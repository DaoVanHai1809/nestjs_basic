export function extractClickupField(
  task: any,
  fieldNames: string[] | string,
  type = 'string',
): any {
  if (typeof fieldNames == 'string') {
    fieldNames = [fieldNames];
  }
  const value = fieldNames.reduce((prev, key) => prev?.[key], task);
  if (type == 'date') return new Date(Number(value));
  if (type == 'array') {
    return value.map((item) => { return item.id.toString()});
  }
  return value;
}

export function extractClickUpCustomDropdownField(fieldData: any): string {
  const fieldDataValue = fieldData?.value;
  const fieldDataOptions = fieldData?.type_config?.options;
  const fieldDataText = fieldDataOptions.find(
    (e) => e.orderindex == fieldDataValue,
  )?.name;
  return fieldDataText;
}

export function extractClickUpCustomDateField(fieldData: any): Date {
  return new Date(Number(fieldData?.value));
}

export function extractClickUpCustomShortTextField(fieldData: any): Date {
  return fieldData?.value;
}

export function extractClickUpCustomUserField(
  fieldData: any,
  override?: string,
): string {
  return fieldData?.value?.[0]?.[override ?? 'id']?.toString?.();
}

export function extractClickUpCustomEmailField(fieldData: any): string {
  return fieldData?.value;
}

export function extractClickUpCustomAttachmentField(fieldData: any): string {
  return fieldData?.value?.[0]?.thumbnail_medium;
}

export function extractClickUpCustomNumberField(fieldData: any): number {
  return fieldData?.value ? parseInt(fieldData?.value) : null;
}

export function extractClickupCustomField(
  task: any,
  name: string,
  override?: string,
) {

  const fieldData = task.custom_fields.find((e) => {
    return e.name == name;
  });
  if (!fieldData) return undefined;
  switch (fieldData.type) {
    case 'drop_down':    
      return extractClickUpCustomDropdownField(fieldData);
    case 'users':
      return extractClickUpCustomUserField(fieldData, override);
    case 'date':
      return extractClickUpCustomDateField(fieldData);
    case 'short_text':
      return extractClickUpCustomShortTextField(fieldData);
    case 'text':
      return extractClickUpCustomShortTextField(fieldData);
    case 'number':
      return extractClickUpCustomNumberField(fieldData);
    case 'email':
      return extractClickUpCustomEmailField(fieldData);
    case 'attachment':
      return extractClickUpCustomAttachmentField(fieldData);
    default:
      return fieldData;
  }
}

export function getFieldData(clickUpTask: any, fieldConfig: any = {}): any {
  if (Object.keys(fieldConfig).includes('field')) {
    return extractClickupField(
      clickUpTask,
      fieldConfig?.field,
      fieldConfig?.type,
    );
  } else if (Object.keys(fieldConfig).includes('customField')) {
    return extractClickupCustomField(
      clickUpTask,
      fieldConfig?.customField,
      fieldConfig?.override,
    );
  }
    
}
