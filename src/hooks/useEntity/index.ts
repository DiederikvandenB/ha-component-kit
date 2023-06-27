import { useEffect, useMemo, useState } from "react";
import { useHass } from '../useHass';
import { isEqual } from 'lodash';
import { HassEntity } from "home-assistant-js-websocket";

export function useEntity(entity: string)  {
  const { getEntity, lastUpdated } = useHass();
  const matchedEntity = getEntity(entity);
  const [ $entity, setEntity ] = useState<HassEntity | null>(matchedEntity);

  useEffect(() => {
    const foundEntity = getEntity(entity);
    if (foundEntity && !isEqual(foundEntity, $entity)) {
      setEntity(foundEntity);
    }
  }, [$entity, entity, getEntity, lastUpdated]);

  return useMemo(() => $entity, [$entity]);
}