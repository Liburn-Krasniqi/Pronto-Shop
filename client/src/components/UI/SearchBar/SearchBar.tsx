import Form from "react-bootstrap/esm/Form";
import classes from "./SearchBar.module.css";
import InputGroup from "react-bootstrap/esm/InputGroup";

export function SearchBar() {
  return (
    <div className="w-100">
      <InputGroup className={`position-relative ${classes.search}`}>
        <Form.Control
          type="search"
          className={`rounded-4 ${classes.searchbar}`}
          placeholder="  Search"
          aria-label="Search"
        />
        {/* Seach Icon on the right */}
        <InputGroup.Text className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 pe-3">
          <img alt="Search Icon" src="/search.svg" />
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
}
