import { toast } from "sonner";

export const SubmissionBinEntryImageInput = ({ setData }) => {
  const handleChange = (e) => {
    let files = [];

    if (e.target.files) {
      files = [...e.target.files];
    }

    if (files.length) {
      files.map((file) => {
        console.log(file.size);
        if (file.size / 1024 > 2024) {
          toast("An image exceeded 2mb limit", {
            type: "error",
          });
          return null;
        } else {
          setData((prevData) => ({
            ...prevData,
            documentation: [...prevData.documentation, file],
          }));
        }
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        name="documentation"
        id="documentation"
        onChange={handleChange}
      />
    </div>
  );
};
