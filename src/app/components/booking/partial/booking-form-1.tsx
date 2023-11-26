"use client";

import InfoSvg from "@/app/assets/svgs/InfoSvg";
import CommonInput from "@/app/components/common/inputs/input";
import CommonInputFile from "@/app/components/common/inputs/fileInput";
import { useTranslation } from "react-i18next";
import React, { FC, useRef, useState } from "react";
import UploadSvg from "@/app/assets/svgs/UploadSvg"
import ImageSvg from "@/app/assets/svgs/ImageSvg"
import Image from "next/image";

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[48%]">{children}</div>
};

export default function BookingForm1({ data, setData }: { data: any, setData: any }) {
  const [photoIdFront, setPhotoIdFront] = useState<string>();
  const [photoIdFrontPreview, setPhotoIdFrontPreview] = useState<string>();
  const [photoIdBack, setPhotoIdBack] = useState<string>();
  const [photoIdBackPreview, setPhotoIdBackPreview] = useState<string>();
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
      setPhotoIdFrontPreview(fileUrl);
      setPhotoIdFront(file.name); // Assuming you want to keep the file name
    }
  };
  const onChangeIdBack = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPhotoIdBackPreview(fileUrl);
      setPhotoIdBack(file.name); // Assuming you want to keep the file name
    }
  };
  return (
    <div className="flex md:flex-row flex-col md:w-[49%] w-full">
      <div className="w-full bg-white rounded-lg">
        <div className="md:p-6 sm:p-8 p-6">
          <form className="" action="#">
            <div className="flex justify-between w-full">
              <FormWrapper>
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] bg-white md:left-4 left-2 px-2">
                  {t("input.first_name")}
                </label>
                <CommonInput
                  type="text"
                  name="text"
                  id="firstname"
                  placeholder="First name"
                  value={data?.properties["First Name"]?.rich_text[0]?.plain_text}
                  onChange={(e: any) => setData({
                    ...data,
                    properties: {
                      ...data.properties,
                      "First Name": {
                        ...data.properties["First Name"],
                        rich_text: [
                          {
                            ...data.properties["First Name"].rich_text[0],
                            plain_text: e.target.value,
                          }
                        ]
                      }
                    }
                  })}
                  required={true}
                />
              </FormWrapper>
              <FormWrapper>
                <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] bg-white md:left-4 left-2 px-2">
                  Last name
                </label>
                <CommonInput
                  type="text"
                  name="text"
                  id="lastname"
                  placeholder="Last name"
                  value={data?.properties["Last Name"]?.rich_text[0]?.plain_text}
                  onChange={(e: any) => setData({
                    ...data,
                    properties: {
                      ...data.properties,
                      "Last Name": {
                        ...data.properties["Last Name"],
                        rich_text: [
                          {
                            ...data.properties["Last Name"].rich_text[0],
                            plain_text: e.target.value,
                          }
                        ]
                      }
                    }
                  })}
                  required={true}
                />
              </FormWrapper>
            </div>
            <div className="relative w-full mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] bg-white md:left-4 left-2 px-2">
                Email
              </label>
              <CommonInput
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required={true}
              />
            </div>
            <div onClick={onClickIdFront} className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">Identity / Passport Picture (Front)</label>
              <input
                ref={IdFront}
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
                    <span className="text-black">Select a file or drag and drop here</span>
                    <span className="greytext mt-2">JPG, PNG or PDF, file size no more than 10MB</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
                  <div className="flex justify-center items-center text-center">
                    <div>
                      {
                        photoIdFrontPreview ?
                          <Image
                            width={20}
                            height={20}
                            src={photoIdFrontPreview}
                            alt="idFront"
                          />
                          :
                          <ImageSvg />
                      }
                    </div>
                    <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">{photoIdFront || "Passport back.png"}</span>
                  </div>
                  <span className="text-black md:text-base text-xs">5.7 MB</span>
                </div>
              </div>
            </div>
            <div onClick={onClickIdBack} className="relative w-full mt-6 border border-gray-300 p-[0.7rem] px-6 rounded-lg">
              <label className="block mb-2 text-sm font-medium text-gray-900 absolute z-10 top-[-0.6rem] bg-white left-4 px-2">Identity / Passport Picture (Back)</label>
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
                    <span className="text-black">Select a file or drag and drop here</span>
                    <span className="greytext mt-2">JPG, PNG or PDF, file size no more than 10MB</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 p-2 bg-bgColor1">
                  <div className="flex justify-center items-center text-center">
                    <div>
                      {
                        photoIdBackPreview ?
                          <Image
                            width={20}
                            height={20}
                            src={photoIdBackPreview}
                            alt="idFront"
                          />
                          :
                          <ImageSvg />
                      }
                    </div>
                    <span className="text-black text-center md:ml-4 ml-2 md:text-base text-xs">{photoIdFront || "Passport back.png"}</span>
                  </div>
                  <span className="text-black md:text-base text-xs">5.7 MB</span>
                </div>
              </div>
            </div>
            <div className="relative w-full mt-6">
              <label className="block mb-2 font-medium text-gray-900 absolute z-10 md:bottom-[1.8rem] bottom-[1.6rem] md:text-sm text-xs bg-white md:left-4 left-2 px-2">
                Billing address
              </label>
              <CommonInput
                type="text"
                name="text"
                id="billingAddress"
                placeholder="Billing Address"
                value={data?.properties["Billing Address"]?.rich_text[0]?.plain_text}
                onChange={(e: any) => setData({
                  ...data,
                  properties: {
                    ...data.properties,
                    "Billing Address": {
                      ...data.properties["Billing Address"],
                      rich_text: [
                        {
                          ...data.properties["Billing Address"].rich_text[0],
                          plain_text: e.target.value,
                        }
                      ]
                    }
                  }
                })}
                required={true}
              />
            </div>
            <div className="flex justify-between w-full mt-6">
              <FormWrapper>
                <label className="block absolute px-2 text-black md:bottom-[1.8rem] bottom-[2rem] z-10 bg-white md:left-4 left-2 md:text-sm text-xs font-medium">
                  Adults passengers
                </label>
                <CommonInput
                  type="number"
                  name="number"
                  id="adultNumber"
                  placeholder="Adult number"
                  value={data?.properties["No Adults"]?.number}
                  onChange={(e: any) => setData({
                    ...data,
                    properties: {
                      ...data.properties,
                      "No Adults": {
                        ...data.properties["No Adults"].number
                      }
                    }
                  })}
                  required={false}
                />
              </FormWrapper>
              <FormWrapper>
                <label className="block px-2 absolute text-black md:bottom-[2.4rem] bottom-[2rem] z-10 bg-white md:left-4 left-2 md:text-sm text-xs  font-medium">
                  Kids passengers
                </label>
                <CommonInput
                  type="number"
                  name="number"
                  id="kidsNumber"
                  placeholder="Kids number"
                  value={data?.properties["No Childs"]?.number}
                  onChange={(e: any) => setData({
                    ...data,
                    properties: {
                      ...data.properties,
                      "No Childs": {
                        ...data.properties["No Childs"].number
                      }
                    }
                  })}
                  required={false}
                />
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
