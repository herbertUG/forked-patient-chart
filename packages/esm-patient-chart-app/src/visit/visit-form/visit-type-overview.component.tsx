import React, { useState, useMemo } from 'react';
import Search from 'carbon-components-react/es/components/Search';
import RadioButtonGroup from 'carbon-components-react/es/components/RadioButtonGroup';
import RadioButton from 'carbon-components-react/es/components/RadioButton';
import { useTranslation } from 'react-i18next';
import styles from './visit-type-overview.component.scss';
import debounce from 'lodash-es/debounce';
import { usePagination, useVisitTypes } from '@openmrs/esm-framework';
import isEmpty from 'lodash-es/isEmpty';
import { PatientChartPagination } from '../../../../esm-patient-common-lib/src';

interface VisitTypeOverviewProps {
  isTablet: boolean;
  onChange: (event) => void;
}

const VisitTypeOverview: React.FC<VisitTypeOverviewProps> = ({ isTablet, onChange }) => {
  const { t } = useTranslation();
  const visitTypes = useVisitTypes();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchResults = useMemo(() => {
    if (!isEmpty(searchTerm)) {
      return visitTypes.filter((visitType) => visitType.display.toLowerCase().search(searchTerm.toLowerCase()) !== -1);
    } else {
      return visitTypes;
    }
  }, [searchTerm, visitTypes]);

  const handleSearch = React.useMemo(() => debounce((searchTerm) => setSearchTerm(searchTerm), 300), []);

  const { results, currentPage, goTo } = usePagination(searchResults, 5);

  return (
    <div className={styles.visitTypeOverviewWrapper}>
      <Search
        onChange={(event) => handleSearch(event.target.value)}
        placeholder={t('searchForAVisitType', 'Search for a visit type')}
        labelText=""
        light={isTablet}
      />
      <RadioButtonGroup
        className={styles.radioButtonGroup}
        defaultSelected="default-selected"
        legend="Group Legend"
        orientation="vertical"
        onChange={onChange}
        name="radio-button-group"
        valueSelected="default-selected">
        {results.map(({ uuid, display, name }) => (
          <RadioButton key={uuid} className={styles.radioButton} id={name} labelText={display} value={uuid} />
        ))}
      </RadioButtonGroup>
      <PatientChartPagination
        pageNumber={currentPage}
        pageUrl={null}
        totalItems={visitTypes?.length}
        currentItems={results.length}
        pageSize={5}
        onPageNumberChange={({ page }) => goTo(page)}
      />
    </div>
  );
};

export default VisitTypeOverview;
