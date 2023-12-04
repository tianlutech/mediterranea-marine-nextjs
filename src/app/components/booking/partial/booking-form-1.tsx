"use client";

import InfoSvg from "@/app/assets/svgs/InfoSvg";
import CommonInput from "@/app/components/common/inputs/input";
import CommonInputFile from "@/app/components/common/inputs/fileInput";
import CommonLabel from "../../common/label/label";
import { useTranslation } from "react-i18next";
import React, { FC, useRef, useState } from "react";
import UploadSvg from "@/app/assets/svgs/UploadSvg";
import ImageSvg from "@/app/assets/svgs/ImageSvg";
import Image from "next/image";
import ErrorMessage from "./errorMessage"
import { Condiment } from "next/font/google";
import CloseSvg from "@/app/assets/svgs/CloseSvg"

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[48%]">{children}</div>;
};

export default function BookingForm1({
  data,
  setData,
  formik,
}: {
  data: any;
  setData: any;
  formik: any
}) {
  const [photoIdFront, setPhotoIdFront] = useState<string>("");
  const [photoIdFrontPreview, setPhotoIdFrontPreview] = useState<string>("");
  const [photoIdFrontSize, setPhotoIdFrontSize] = useState<string>("");
  const [photoIdBack, setPhotoIdBack] = useState<string>("");
  const [photoIdBackPreview, setPhotoIdBackPreview] = useState<string>("");
  const [photoIdBackSize, setPhotoIdBackSize] = useState<string>("");
  const { t } = useTranslation();
  const IdFront = useRef<any>();
  const IdBack = useRef<any>();
  const onClickIdFront = () => {
    (IdFront.current as any).click();
  };
  const onClickIdBack = () => {
    (IdBack.current as any).click();
  };

  const onChangeIdFront = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileSizeInBytes = file.size;
      const fileSizeInKilobytes: any = (fileSizeInBytes / 1024).toFixed(1);
      const fileSizeInMegabytes: any = (fileSizeInKilobytes / 1024).toFixed(1);
      if (fileSizeInMegabytes < 1) {
        setPhotoIdFrontSize(`${fileSizeInKilobytes} KB`);
      }
      setPhotoIdFrontSize(`${fileSizeInMegabytes} MB`);
      setPhotoIdFrontPreview(fileUrl);
      setPhotoIdFront(file.name); // Assuming you want to keep the file name
      setData({ ...data, "ID Front Picture": file });
    }
  };
  const onChangeIdBack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileSizeInBytes = file.size;
      const fileSizeInKilobytes: any = (fileSizeInBytes / 1024).toFixed(1);
      const fileSizeInMegabytes: any = (fileSizeInKilobytes / 1024).toFixed(1);
      if (fileSizeInMegabytes < 1) {
        setPhotoIdBackSize(`${fileSizeInKilobytes} KB`);
      }
      setPhotoIdBackSize(`${fileSizeInMegabytes} MB`);
      setPhotoIdBackPreview(fileUrl);
      setPhotoIdBack(file.name);
      setData({ ...data, "ID Back Picture": file });
    }
  };
  const removeFrontImage = () => {
    setData({ ...data, "ID Front Picture": {} });
    setPhotoIdFrontSize("");
    setPhotoIdFrontPreview("");
    setPhotoIdFront("");
  }
  const removeBackImage = () => {
    setData({ ...data, "ID Back Picture": {} });
    setPhotoIdBackSize("");
    setPhotoIdBackPreview("");
    setPhotoIdBack("");
  }
  return (
    <div className="flex md:flex-row flex-col md:w-[49%] w-full">
      <div className="w-full bg-white rounded-lg">
        <div className="md:p-6 sm:p-8 p-6">
          <form className="" action="#">
            <div className="flex justify-between w-full">
              <FormWrapper>
                <CommonLabel input="text" error={formik.errors["First Name"]}>
                  First name
                </CommonLabel>
                <CommonInput
                  type="text"
                  name="First Name"
                  id="firstname"
                  placeholder="First name"
                  value={data["First Name"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, "First Name": e.target.value })
                  }
                  required={true}
                />
                <ErrorMessage formik={formik} name="First Name" />
              </FormWrapper>
              <FormWrapper>
                <CommonLabel input="text" error={formik.errors["Last Name"]}>
                  Last name
                </CommonLabel>
                <CommonInput
                  type="text"
                  name="Last Name"
                  id="lastname"
                  placeholder="Last name"
                  value={data["Last Name"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, "Last Name": e.target.value })
                  }
                  required={true}
                />
                <ErrorMessage formik={formik} name="Last Name" />
              </FormWrapper>
            </div>
            <div className="relative w-full mt-6">
              <CommonLabel input="text" error={formik.errors["Email"]}>
                Email
              </CommonLabel>
              <CommonInput
                type="email"
                name="Email"
                id="email"
                placeholder="Email"
                value={data["Email"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, Email: e.target.value })
                }
                required={true}
              />
              <ErrorMessage formik={formik} name="Email" />
            </div>
            <div className="relative">
              {photoIdFront && (
                <div onClick={removeFrontImage} className="absolute cursor-pointer z-20 rounded-full bg-black w-5 bottom-11 right-4">
                  <CloseSvg />
                </div>
              )}
              <div
                onClick={onClickIdFront}
                className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg"
              >
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">
                  Identity / Passport Picture (Front)
                </label>
                <input
                  ref={IdFront}
                  name="ID_Front_Picture"
                  type="file"
                  hidden
                  onChangeCapture={onChangeIdFront}
                  accept="image/*"
                />
                <div>
                  <div className="flex mt-3">
                    <div>
                      <UploadSvg />
                    </div>
                    <div className="flex flex-col ml-4">
                      <span className="text-black">
                        Select a file or drag and drop here
                      </span>
                      <span className="greytext mt-2">
                        JPG, PNG or PDF, file size no more than 10MB
                      </span>
                    </div>
                  </div>
                  {photoIdFront && (
                    <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
                      <div className="flex justify-center items-center text-center">
                        <div>
                          {photoIdFrontPreview ? (
                            <Image
                              width={20}
                              height={20}
                              src={photoIdFrontPreview}
                              alt="idFront"
                            />
                          ) : (
                            <ImageSvg />
                          )}
                        </div>
                        <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">
                          {photoIdFront}
                        </span>
                      </div>
                      <span className="text-black md:text-base text-xs">
                        {photoIdFrontSize}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <ErrorMessage formik={formik} name="ID Front Picture" />
            <div className="relative">
              {photoIdBack && (
                <div onClick={removeBackImage} className="absolute cursor-pointer z-20 rounded-full bg-black w-5 bottom-11 right-4">
                  <CloseSvg />
                </div>
              )}
              <div
                onClick={onClickIdBack}
                className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg"
              >
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">
                  Identity / Passport Picture (Back)
                </label>
                <input
                  ref={IdBack}
                  type="file"
                  hidden
                  onChangeCapture={onChangeIdBack}
                  accept="image/*"
                />
                <div>
                  <div className="flex mt-3">
                    <div>
                      <UploadSvg />
                    </div>
                    <div className="flex flex-col ml-4">
                      <span className="text-black">
                        Select a file or drag and drop here
                      </span>
                      <span className="greytext mt-2">
                        JPG, PNG or PDF, file size no more than 10MB
                      </span>
                    </div>
                  </div>
                  {photoIdBackPreview && (
                    <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
                      <div className="flex justify-center items-center text-center">
                        <div>
                          {photoIdBackPreview ? (
                            <Image
                              width={20}
                              height={20}
                              src={photoIdBackPreview}
                              alt="idFront"
                            />
                          ) : (
                            <ImageSvg />
                          )}
                        </div>
                        <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">
                          {photoIdBack || "Passport back.png"}
                        </span>
                      </div>
                      <span className="text-black md:text-base text-xs">
                        {photoIdBackSize}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ErrorMessage formik={formik} name="ID Back Picture" />
            <div className="relative w-full mt-6">
              <CommonLabel input="text" error={formik.errors["Last Name"]}>
                Billing address
              </CommonLabel>
              <CommonInput
                type="text"
                name="Billing address"
                id="billingAddress"
                placeholder="Billing Address"
                value={data["Billing Address"]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, "Billing Address": e.target.value })
                }
                required={true}
              />
              <ErrorMessage formik={formik} name="Billing Address" />
            </div>
            <div className="flex justify-between w-full mt-6">
              <FormWrapper>
                <CommonLabel input="text" error={formik.errors["No Adults"]}>
                  Adults passengers
                </CommonLabel>
                <CommonInput
                  type="number"
                  name="number"
                  id="adultNumber"
                  placeholder="Adult number"
                  value={data["No Adults"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, "No Adults": e.target.value })
                  }
                  required={false}
                />
                <ErrorMessage formik={formik} name="No Adults" />
              </FormWrapper>
              <FormWrapper>
                <CommonLabel input="text" error={formik.errors["No Childs"]}>
                  Kids passengers
                </CommonLabel>
                <CommonInput
                  type="number"
                  name="number"
                  id="kidsNumber"
                  placeholder="Kids number"
                  value={data["No Childs"]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, "No Childs": e.target.value })
                  }
                  required={false}
                />
                <ErrorMessage formik={formik} name="No Childs" />
              </FormWrapper>
            </div>
            <div className="mt-6 text-black flex">
              <div>
                <InfoSvg />
              </div>
              <span className="text-sm ml-2">
                We require to know this information to prepare the lifevest and
                other equipment accordingly
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
