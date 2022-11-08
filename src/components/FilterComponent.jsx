import React from "react";
import {
  Form,
  Button,
  InputGroup,
  Row
} from 'react-bootstrap'

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>

    <Row lg="4">
      <InputGroup className="mb-3">
        <Form.Control
          id="search"
          type="text"
          placeholder="Buscar..."
          value={filterText}
          onChange={onFilter}
        />
        <Button
          variant="outline-secondary"
          onClick={onClear}
        >
          X
        </Button>
      </InputGroup>
    </Row>
  </>
);

export default FilterComponent;
