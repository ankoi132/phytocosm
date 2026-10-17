import React from "react";
import { PLANT_SPECIMENS } from "@/data/plants";
import SpecimenDissectionClient from "@/components/specimens/SpecimenDissectionClient";

export async function generateStaticParams() {
  return PLANT_SPECIMENS.map((specimen) => ({
    id: specimen.id,
  }));
}

export default async function SpecimenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SpecimenDissectionClient id={id} />;
}
