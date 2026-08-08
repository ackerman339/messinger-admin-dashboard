import { columnVisibilityFeature, tableFeatures } from '@tanstack/react-table';

export const tableFeatureSet = tableFeatures({
  columnVisibilityFeature,
});

export type TableFeatures = typeof tableFeatureSet;
