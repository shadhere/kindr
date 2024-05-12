import KindrLogo from "@/images/Logo.png";
import Image from "next/image";

export function Logo(props: any) {
  return <Image src={KindrLogo} alt="" height={24} width={100} />;
}
