"use client";

export default function ErrorMessage({ formik, name }: { formik: any, name: string }) {
  return formik.errors[name] || formik.touched[name] ? (
    <div className="error text-red-500">{formik.errors[name]}</div>
  ) : null;
}
