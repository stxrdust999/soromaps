import { CircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="mt-auto px-8 py-8 bg-black">
      <div className="flex flex-col gap-4">
        {/* logo & social media */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 items-center">
            <Image
              src="/logo/logoipsum-emblem.svg"
              alt="Logo"
              width={35}
              height={35}
            />

            <span className="font-bold text-lg text-white">soromaps</span>
          </div>

          <div className="flex flex-row gap-3 items-center">
            <Link
              href={"https://github.com/stxrdust999/soromaps_web/"}
              className="hover:no-underline"
            >
              <SiGithub className="text-white" size={20} />
            </Link>

            <Link href={"/#"} className="hover:no-underline">
              <SiInstagram className="text-white" size={20} />
            </Link>

            <Link href={"/#"} className="hover:no-underline">
              <SiX className="text-white" size={20} />
            </Link>
          </div>
        </div>

        {/* description */}
        <div className="w-120">
          <span className="text-xs leading-1.2 text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
            ullam sunt rerum ad mollitia sit excepturi molestias autem tempora.
          </span>
        </div>

        {/* useful links */}
        <div className="flex flex-row gap-4">
          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-blue-600 border border-transparent items-center self-center"
            href="#"
          >
            Home
          </Link>
          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-blue-600 border border-transparent items-center self-center"
            href="#"
          >
            About us
          </Link>
          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-blue-600 border border-transparent items-center self-center"
            href="#"
          >
            Solutions
          </Link>
          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-blue-600 border border-transparent items-center self-center"
            href="#"
          >
            Resources
          </Link>
          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-blue-600 border border-transparent items-center self-center"
            href="#"
          >
            Testimonials
          </Link>
        </div>
      </div>

      <Separator className="my-6 bg-white" />

      {/* license, policies */}
      <div className="flex flex-row justify-between">
        <span className="text-xs text-white">
          © 2026 Soromaps - Todos os direitos reservados
        </span>

        <div className="flex flex-row gap-2 items-center">
          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-white border border-transparent items-center self-center"
            href="#"
          >
            Política de Privacidade
          </Link>

          <CircleIcon fill="white" size={8} />

          <Link
            className="h-auto hover:no-underline w-auto text-xs font-semibold p-0 text-white hover:text-white border border-transparent items-center self-center"
            href="#"
          >
            Política de Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
