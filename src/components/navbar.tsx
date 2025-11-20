"use client";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname()
  return (
    <div className="bg-gray-100">
      <div className="flex items-center justify-between px-10 py-4">
        <h1 className="text-2xl font-bold">
            {pathname === "/dashboard" ? "Dashboard" : "Profile"}
        </h1>
        <div className="flex gap-5">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => {
              router.push(pathname === "/dashboard" ? "/profile" : "/dashboard");
            }}
          >
            {pathname === "/dashboard" ? "Profile" : "Dashboard"}
          </button>
          { pathname === "/dashboard" &&
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </button>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
