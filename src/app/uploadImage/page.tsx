"use client"

import React, { useState, useEffect, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "@/app/services/firebase";
import { v4 } from "uuid";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarLoader } from "react-spinners";

const UploadImage = () => {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const imagesListRef = ref(storage, "/image");

  const uploadFile = () => {
    if (imageUpload == null) return;

    const imageName = imageUpload.name;
    const extension = imageName.split('.').pop();
    const randomString = v4();
    const newImageName = imageName.replace(`.${extension}`, '') + randomString + `.${extension}`;

    const imageRef = ref(storage, `/image/${newImageName}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await listAll(imagesListRef);
        const urls = await Promise.all(response.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return url;
        }));
        setImageUrls(urls);
      } catch (error) {
        console.error("Erro ao obter URLs de imagem:", error);
      }
    };

    fetchImageUrls();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full flex-col">
      <div className="grid w-full max-w-sm items-center border p-4 m-4 gap-4">
        <h1 className="text-2xl font-bold">Image Upload</h1>
        <Label htmlFor="picture">Imagem</Label>
        <Input id="picture" type="file" onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setImageUpload(event.target.files![0]);
        }} />
        <Button onClick={uploadFile} variant="outline">Button</Button>
      </div>
      <div>
        {imageUrls.length === 0 ? (
          <BarLoader />
        ) : (
          imageUrls.map((url) => (
            <div key={v4()}>
              <Image src={url}
                width="0"
                height="0"
                sizes="100vw"
                className="w-[200px] h-auto"
                alt=""
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadImage;
