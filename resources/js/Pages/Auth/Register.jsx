import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Image, Container, Button } from "react-bootstrap";
import { parse } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function Register({ classifications }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    firstname: "",
    email: "",
    password: "",
    type: "unit_head",
    classificationIndex: null,
    password_confirmation: "",
    lastname: "",
    campusIndex: null,
  });

  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    const fetchCampuses = async () => {
      const response = await axios.get(route("campus.index"));
      //   setState((prev) => ({ ...prev, campuses: response.data.campuses }));
      setCampuses(response.data.campuses);
    };
    fetchCampuses();
  }, []);

  const handleClassificationChange = (e) => {
    setData("classificationIndex", parseInt(e.target.value));
  };

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const handleCampusChange = (e) => {
    setData("campusIndex", parseInt(e.target.value));
  };

  const submit = (e) => {
    e.preventDefault();

    console.log("data: ", data);

    // check firstname, lastname, email, password, password_confirmation, classificationIndex, campusIndex
    if (
      !data.firstname ||
      !data.lastname ||
      !data.email ||
      !data.password ||
      !data.password_confirmation ||
      !data.classificationIndex ||
      !data.campusIndex
    ) {
      toast.error("Please fill out all fields");
      return;
    }

    if (data.password !== data.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
    }

    if (data.classificationIndex === null) {
      toast.error("Please select a classification");
      return;
    }

    if (data.campusIndex === null) {
      toast.error("Please select a campus");
    }

    post(route("register"));
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center before:fixed before:inset-0 justify-center min-h-screen before:content-[''] before:bg-cover before:bg-[url('/images/signin-bg.jpg')] before:opacity-20 before:bg-center">
        <Head title="Log in" />

        <Container className="z-50">
          <form
            onSubmit={submit}
            className="pt-4 col-md-6 bg-black/70  p-6 rounded-lg mx-auto"
          >
            <div>
              <p className="text-xl text-center text-white">Register now</p>
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
            <div className="flex justify-between">
              {/* firstname */}

              <div className="">
                <InputLabel
                  htmlFor="name"
                  value="First Name"
                  className="text-white"
                />

                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  value={data.firstname}
                  className="mt-1 block w-full"
                  autoComplete="firstname"
                  isFocused={true}
                  onChange={(e) => setData("firstname", e.target.value)}
                />

                <InputError message={errors.firstname} className="mt-2" />
              </div>

              {/* lastname */}
              <div className="">
                <InputLabel
                  htmlFor="lastname"
                  value="Last Name"
                  className="text-white"
                />

                <TextInput
                  id="lastname"
                  type="text"
                  name="lastname"
                  value={data.lastname}
                  className="mt-1 block w-full"
                  autoComplete="lastname"
                  onChange={(e) => setData("lastname", e.target.value)}
                />

                <InputError message={errors.lastname} className="mt-2" />
              </div>
            </div>

            <div className="mt-4">
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

            <div className="flex justify-between">
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

              {/* confirm password */}
              <div className="mt-4">
                <InputLabel
                  htmlFor="password_confirmation"
                  value="Confirm Password"
                  className="text-white"
                />

                <TextInput
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  className="mt-1 block w-full"
                  autoComplete="current-password"
                  onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                  }
                />

                <InputError
                  message={errors.password_confirmation}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div className="z-50 mt-4 ">
                <div>
                  <p className=" text-white mb-0 font-medium text-[0.9rem]">
                    Select Classification
                  </p>
                </div>
                <select
                  required
                  className="border-slate-300 w-[96%] rounded-md hover:border-slate-400"
                  defaultValue={""}
                  onChange={handleClassificationChange}
                >
                  <option value={""} disabled>
                    All Offices
                  </option>
                  {classifications &&
                    classifications.map((c, index) => (
                      <optgroup key={index + 1} label={c.name}>
                        {c.designations.map((desig, i) => (
                          <option value={desig.id} key={desig.id}>
                            {desig.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                </select>
              </div>

              <div className="z-50 mt-4">
                <div>
                  <p className="font-medium text-[0.9rem] text-white mb-0">
                    Select Campus
                  </p>
                </div>
                <select
                  className="border-slate-300 rounded-md hover:border-slate-400"
                  name="campus"
                  onChange={handleCampusChange}
                  id="campus"
                >
                  <option>Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <div className="flex w-full">
                <Link
                  href={route("unithead.login")}
                  className="text-sm text-white hover:text-gray-400"
                >
                  Already have an account? Sign in{" "}
                </Link>
              </div>
              <Button type="submit" className="ml-4" disabled={processing}>
                Register
              </Button>
            </div>
          </form>
        </Container>
      </div>
    </AppLayout>
  );
}
