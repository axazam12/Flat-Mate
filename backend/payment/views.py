from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from dateutil.relativedelta import relativedelta

from .models import RentPayment
from .serializers import RentPaymentSerializer

from datetime import date

from notification.models import Notification
# Create your views here.

class RentPaymentViewSet(viewsets.ModelViewSet):
    queryset = RentPayment.objects.all()
    serializer_class = RentPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = date.today()

        RentPayment.objects.filter(due_date__lt=today,status="Pending").update(status="Late")
        user= self.request.user

        queryset = RentPayment.objects.select_related("tenant","lease","lease__owner","lease__property").order_by("-year","-month")

        if user.role == "Owner":
            return queryset.filter(lease__owner=user)
        return queryset.filter(tenant=user)
    
    @action(detail=False, methods=["get"])
    def current(self,request):
        payment = (RentPayment.objects.filter(tenant=request.user,status__in=["Pending","Late"],lease__status="Active").order_by("due_date").first())
        if not payment:
            return Response({"detail":"No pending payment"})
        serializer = self.get_serializer(payment,context={"request":request})

        return Response(serializer.data)

    def create_next_payment(self,payment):
        lease = payment.lease
        next_due = payment.due_date + relativedelta(months=1)

        if lease.status != "Active":
            return None

        if lease.lease_end and next_due > lease.lease_end:
            return
            
        next_payment, created = RentPayment.objects.get_or_create(
            lease=lease,
            tenant=lease.tenant,
            month=next_due.month,
            year=next_due.year,
            defaults={ 
                "amount": lease.monthly_rent,
                "due_date": next_due,
                "status" : "Pending"
            } 
        )
        return next_payment
    
    @action(detail=True,methods=["patch"])
    def pay(self, request,pk=None):
        payment = self.get_object()

        if payment.tenant != request.user:
            return Response({"error":"You are not allowed to pay this rent."})
        
        if payment.status == "Paid":
            return Response({"error":"Rent already paid."})

        payment_method = request.data.get("payment_method")
        if not payment_method:
            return Response({"error":"Payment method is required."})

        payment.payment_method = request.data.get("payment_method")
        payment.transaction_id = request.data.get("transaction_id","")
        payment.paid_date = date.today()
        payment.status = "Paid"
        payment.paid_amount = request.data.get("paid_amount",payment.amount)
        payment.save(update_fields=["payment_method","transaction_id","paid_date","paid_amount","status"])

        self.create_next_payment(payment)

        Notification.objects.create(
            user=payment.lease.owner,
            title="Rent Received",
            message = f"{payment.tenant.full_name or payment.tenant.username} paid rent for {payment.month}/{payment.year}.",
            notification_type = "Rent"
        )

        serializer = self.get_serializer(payment,context={"request":request})
        return Response(serializer.data)
    
    @action(detail=False,methods=["get"])
    def pending(self,request):
        if request.user.role == "Owner":
            payments = RentPayment.objects.filter(lease__owner=request.user,status__in=["Pending","Late"])
        else:
            payments = RentPayment.objects.filter(tenant=request.user,status__in=["Pending","Late"])

        serializer = self.get_serializer(payments,many=True,context={"request":request})
        return Response(serializer.data)
    
    @action(detail=False,methods=["get"])
    def history(self,request):
        if request.user.role == "Owner":
            payments = RentPayment.objects.filter(lease__owner=request.user).select_related("lease","lease__property","tenant")
        else:
            payments = RentPayment.objects.filter(tenant=request.user).select_related("lease","lease__property","lease__owner")
        payments = payments.order_by("-year","-month")
        
        serializer = self.get_serializer(payments,many=True,context={"request":request})
        return Response(serializer.data)

    @action(detail=True,methods=["post"])
    def mark_paid(self,request,pk=None):
        payment = self.get_object()

        if payment.lease.owner != request.user:
            return Response({"error":"Permission denied"})
        
        if payment.status == "Paid":
            return Response({"error":"Payment already marked as paid"})
        
        payment.status = "Paid"
        payment.paid_date = date.today()

        payment.paid_amount = request.data.get("paid_amount",payment.amount)
        payment.payment_method = request.data.get("payment_method","")
        payment.transaction_id = request.data.get("transaction_id","")

        if "receipt" in request.FILES:
            payment.receipt = request.FILES["receipt"]

        payment.save()

        self.create_next_payment(payment)

        Notification.objects.create(
            user=payment.tenant,
            title="Rent Payment Confirmed",
            message=f"Your rent payment for" f"{payment.month}/{payment.year} " f"has been confirmed.",
            notification_type="Rent"
        )
        serializer = self.get_serializer(payment,context={"request":request})
        return Response(serializer.data)

    @action(detail=True,methods=["patch"])
    def upload_receipt(self,request,pk=None):
        payment = self.get_object()
        if payment.lease.owner != request.user:
            return Response({"error":"Permission denied."})
        if payment.status !="Paid":
            return Response({"error":"Receipt an only be upload for a paid payment."})
        receipt = request.FILES.get("receipt")
        if not receipt:
            payment.receipt.delete(save=False)
        payment.receipt = receipt
        payment.save(update_fields=["receipt"])

        serializer = self.get_serializer(payment,context={"request":request})
        return Response({"message":"Receipt uploaded successfully.","payment":serializer.data})

    @action(detail=True,methods=["delete"])
    def delete_receipt(self,request,pk=None):
        payment = self.get_object()

        if payment.lease.owner != request.user:
            return Response({"error":"Permission denied."})
        if not payment.receipt:
            return Response({"error":"No receipt available."})
        payment.receipt.delete(save=False)
        payment.receipt = None
        payment.save(update_fields=["receipt"])
        return Response({"message":"Receipt deleted successsfully."})
    