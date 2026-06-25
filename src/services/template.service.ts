import { loadTemplate } from "utils/loadTemplate";

export const generateEmailTemplate = async (
  name: string,
  data: Record<string, string | number>,
  styles: Record<string, string>,
) => {
  const template = await loadTemplate(name);
  return template({ ...data, ...styles }); // spread both flat
};
