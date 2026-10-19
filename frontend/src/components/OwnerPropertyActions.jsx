import{Link} from "react-router-dom"

function OwnerPropertyActions({property, onDelete, onAvailable, onUnavailable}){
    return (
        <div className="owner-actions">
            <h3>Owner Actions</h3>
            <div className="action-grid">
                <Link to={`/owner-dashboard/edit-property/${property.id}`} className="edit-btn">Edit Property</Link>

                <button className="delete-btn" onClick={() => onDelete(property.id)}>Delete Property</button>

                {property.status === "Available" ?(
                    <button className="status-btn unavailable" onClick={() => onUnavailable(property.id)}>
                        Mark Unavailable
                    </button>

                ):(
                    <button className="status-btn available" onClick={()=> onAvailable(property.id)}>
                        Mark Available
                    </button>


                )} 
                <Link className="upload-btn" to={`/owner-dashboard/property-images/${property.id}`}>
                Manage Images</Link>
            </div>
        </div>
    )
}
export default OwnerPropertyActions;