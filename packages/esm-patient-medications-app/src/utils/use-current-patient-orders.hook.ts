import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { createErrorHandler, openmrsFetch } from '@openmrs/esm-framework';
import { fetchPatientOrders, PatientMedicationFetchResponse } from '../api/api';
import { Order } from '../types/order';
import { careSetting } from '../constants';

/**
 * Fetches the orders belonging of a patient and optional provides a way to trigger a re-fetch of
 * that data on demand.
 * @param patientUuid The UUID of the patient whose orders should be fetched.
 * @param status The status/the kind of orders to be fetched.
 */
export function usePatientOrders(patientUuid: string, status: 'ACTIVE' | 'any') {
  const { data, error } = useSWR<{ data: PatientMedicationFetchResponse }, Error>(
    `/ws/rest/v1/order?patient=${patientUuid}&careSetting=${careSetting}&status=${status}&v=custom:(uuid,dosingType,orderNumber,accessionNumber,patient:ref,action,careSetting:ref,previousOrder:ref,dateActivated,scheduledDate,dateStopped,autoExpireDate,orderType:ref,encounter:ref,orderer:ref,orderReason,orderReasonNonCoded,orderType,urgency,instructions,commentToFulfiller,drug:(uuid,name,strength,dosageForm:(display,uuid),concept),dose,doseUnits:ref,frequency:ref,asNeeded,asNeededCondition,quantity,quantityUnits:ref,numRefills,dosingInstructions,duration,durationUnits:ref,route:ref,brandName,dispenseAsWritten)`,
    openmrsFetch,
  );

  const drugOrders = data?.data?.results
    ? data.data.results.filter((order) => order.orderType.display === 'Drug Order')
    : null;

  return {
    data: data ? drugOrders : null,
    isLoading: !data && !error,
    isError: error,
  };
}
// export function usePatientOrders(
//   patientUuid: string,
//   status: 'ACTIVE' | 'any',
// ): [Array<Order> | null, (abortController?: AbortController) => Promise<unknown>] {
//   const [orders, setOrders] = useState<Array<Order>>(null);
//   const fetchOrders = (abortController?: AbortController) => {
//     return fetchPatientOrders(patientUuid, status, abortController).then((orders) => {
//       setOrders(orders);
//     }, createErrorHandler);
//   };

//   useEffect(() => {
//     const abortController = new AbortController();
//     fetchOrders(abortController);
//     return () => abortController.abort();
//   }, [patientUuid]);

//   return [orders, fetchOrders];
// }
