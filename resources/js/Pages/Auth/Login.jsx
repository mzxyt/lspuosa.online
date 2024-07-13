import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import CustomSelectDropdown from "@/Components/SignInDropdownButton";
import AppLayout from "@/Layouts/AppLayout";
import ModalComponent from "@/Components/ModalComponent";
import { useState } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { toast } from "sonner";

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
    type: "unit_head",
  });

  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();

    if (data.email === "" || data.password === "") {
      toast.error("Please fill in all fields");
      return;
    }

    post(route("users.login"));
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center before:fixed before:inset-0 justify-center min-h-screen before:content-[''] before:bg-cover before:bg-[url('/images/signin-bg.jpg')] before:opacity-20 before:bg-center">
        <Head title="Log in" />

        {status && (
          <div className="mb-4 font-medium text-sm text-green-600">
            {status}
          </div>
        )}
        <Container className="z-50">
          <form
            onSubmit={submit}
            className="pt-4 col-md-6 bg-black/70  p-6 rounded-lg mx-auto"
          >
            <div>
              <p className="text-xl text-center text-white">Welcome to</p>
              <Image
                src="/images/logo.png"
                fluid
                width={174}
                height={174}
                className="mx-auto"
              />
              <p className="mb-6 text-center text-2xl font-medium text-white drop-shadow mt-3">
                Office of Student Affairs
              </p>
            </div>
            <div className="">
              <InputLabel
                htmlFor="email"
                value="Email"
                className="text-white"
              />

              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData("email", e.target.value)}
              />

              <InputError message={errors.email} className="mt-2" />
            </div>

            {/* password */}
            <div className="mt-4">
              <InputLabel
                htmlFor="password"
                value="Password"
                className="text-white"
              />

              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full"
                autoComplete="current-password"
                onChange={(e) => setData("password", e.target.value)}
              />

              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="flex items-center  mt-4">
              {/* back button */}
              <div className="flex w-full">
                <Link
                  href={route("register")}
                  className="text-sm text-white hover:text-gray-400"
                >
                  Dont have an account? Create Now!
                </Link>
              </div>
              <Link
                href={route("welcome")}
                className="text-sm text-white w-[5rem] hover:text-gray-400"
              >
                Back
              </Link>
              <Button
                type="submit"
                className="ml-4 w-[10rem]"
                disabled={processing}
              >
                Log in
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </AppLayout>
  );
}
