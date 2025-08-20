export const categoryOptions = [
  { value: 'health', label: 'Здоровье' },
  { value: 'productivity', label: 'Продуктивность' },
  { value: 'learning', label: 'Обучение' },
  { value: 'other', label: 'Другое' },
];

const categoryMap = Object.fromEntries(
  categoryOptions.map((option) => [option.value, option.label]),
);

export const getCategoryLabel = (value: string): string => {
  return categoryMap[value] || value;
};
