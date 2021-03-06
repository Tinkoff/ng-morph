import { getDecorators } from 'ng-morph/decorators';
import { ClassDeclaration, Node } from 'ts-morph';

// TODO: investigate how to handle consts in descriptors that don't accept array of array type, like styleUrls
export function pushToArrayProperty(
  classDeclaration: ClassDeclaration,
  decoratorName: string,
  propertyName: string,
  initializer: string,
  {
    unique = false,
    forceToArray = false,
  }: { unique?: boolean; forceToArray?: boolean } = {}
) {
  const [decorator] = getDecorators(classDeclaration, {
    name: decoratorName,
  });

  const [
    metadata = decorator.addArgument(`{${propertyName}: []}`),
  ] = decorator.getArguments();

  if (!Node.isObjectLiteralExpression(metadata)) {
    return;
  }

  const property =
    metadata.getProperty(propertyName) ??
    metadata.addProperty(`${propertyName}: []`);

  if (!Node.isPropertyAssignment(property)) {
    return;
  }

  if (
    forceToArray &&
    !Node.isArrayLiteralExpression(property.getInitializer())
  ) {
    property.setInitializer(`[${property.getInitializer().getText()}]`);
  }

  const importsInitializer = property.getInitializer();

  if (!Node.isArrayLiteralExpression(importsInitializer)) {
    return;
  }

  if (
    unique &&
    importsInitializer
      .getElements()
      .some((element) => element.getText() === initializer)
  ) {
    return;
  }

  importsInitializer.addElement(initializer);
}
