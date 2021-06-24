import { ClassDeclaration } from 'ts-morph';
import { pushToArrayProperty } from '../helpers/push-to-array-property';

export function addExportToNgModule(
  classDeclaration: ClassDeclaration,
  exportName: string,
  { unique }: { unique: boolean } = { unique: false }
) {
  pushToArrayProperty(classDeclaration, 'NgModule', 'exports', exportName, {
    unique,
    forceToArray: true,
  });
}
