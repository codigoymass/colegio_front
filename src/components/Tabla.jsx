import React, { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component';
import FilterComponent from './FilterComponent';

export default function Tabla({columnas, filas}) {

  const [filterText, setFilterText] = useState('');

	const filteredItems = filas.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );

	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setFilterText('');
			}
		};

		return (
			<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText]);

  return (
    <DataTable
      columns={columnas}
      data={filteredItems}
      subHeaderComponent={subHeaderComponentMemo}
      subHeader
      pagination
    />
  )
}
