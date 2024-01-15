export type OCRResult = { value: string; confidence: number };
export type IdentityData = {
  last_name: OCRResult;
  given_names: [OCRResult];
  birth_place: OCRResult;
  issuance_data: OCRResult;
  expire_date: OCRResult;
  document_id: OCRResult;
  issuing_state: OCRResult;
  address: OCRResult;
  age: OCRResult;
  country: OCRResult;
  document_type: OCRResult;
  gender: OCRResult;
  image_id: [OCRResult];
  image_signature: [OCRResult];
  mrz: OCRResult;
  nationality: OCRResult;
};

export type IdentityValidation = {
  status: "success" | "error";
  extracted_data: [IdentityData];
  cost: number;
  error: string;
};

export type IDentityResult = {
  amazon?: IdentityValidation;
  microsoft?: IdentityValidation;
  base64?: IdentityValidation;
  "eden-ai": IdentityValidation; // This gets the most confidence value of each result
};
