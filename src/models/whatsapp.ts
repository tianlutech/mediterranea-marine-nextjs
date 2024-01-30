export type WhatsappTemplate = {
  category: string;
  id: string;
  name: string;
  language: string;
  components: Array<{ type: string; text: string; format: string }>;
};
