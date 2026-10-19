import { useState } from "react";
import "../css/searchbar.css"

function SearchBar({onSearch}) {
    const [search, setSearch] = useState("")

    const handleSubmit = (e)=>{
        e.preventDefault();
        onSearch(search)
    }

    const handleClear = () =>{
        setSearch("")
        onSearch("");
        
    }

    return(
        <form className="search-bar" onSubmit={handleSubmit}>
            <input type="text" placeholder="Search properties by title or city ..." value={search} onChange={(e) => {setSearch(e.target.value);onSearch(e.target.value)}}/>
            <button type="submit">Search</button>
            <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
        </form>
    )
}

export default SearchBar;