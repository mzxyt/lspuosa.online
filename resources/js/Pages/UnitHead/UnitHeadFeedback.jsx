import PanelLayout from "@/Layouts/PanelLayout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button, ButtonGroup, Container, Form, Image } from "react-bootstrap";

export default function UnitHeadFeedback() {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showReactionError, setShowReactionError] = useState(false);
  const [selectedType, setSelectedType] = useState("Suggestion");
  const [comment, setComment] = useState("");

  const { data, setData, post, reset } = useForm({
    reaction: null,
    type: "Suggestion",
    comment: "",
  });

  const reactions = [
    {
      text: "Very Unsatisfied",
      image: "/images/reactions/very-unsatisfied.svg",
      toggledImage: "/images/reactions/very-unsatisfied-toggled.svg",
    },
    {
      text: "Unsatisfied",
      image: "/images/reactions/unsatisfied.svg",
      toggledImage: "/images/reactions/unsatisfied-toggled.svg",
    },
    {
      text: "Neutral",
      image: "/images/reactions/neutral.svg",
      toggledImage: "/images/reactions/neutral-toggled.svg",
    },
    {
      text: "Satisfied",
      image: "/images/reactions/satisfied.svg",
      toggledImage: "/images/reactions/satisfied-toggled.svg",
    },
    {
      text: "Very Satisfied",
      image: "/images/reactions/very-satisfied.svg",
      toggledImage: "/images/reactions/very-satisfied-toggled.svg",
    },
  ];

  const onSubmit = () => {
    if (data.reaction == null) {
      toast.error("You need to select a reaction first!");
      setShowReactionError(true);
      return;
    }
    setData("reaction", null);
    setData("type", "Suggestion");
    reset("comment");
    post(route("feedback.create"));
  };

  return (
    <PanelLayout defaultActiveLink="feedback">
      <Container className="bg-white p-8 mt-10 rounded-md shadow-md">
        <div className="text-center">
          <p className="mt-2 mb-3 text-secondary">
            We would like your feedback to improve this office.
          </p>
          <p className="my-2 text-purple">How do you feel about this office?</p>
        </div>
        <br />
        <div className="flex justify-center gap-4 mt-2 mb-2">
          {reactions.map((reaction, index) => (
            <div key={index}>
              {reaction.text == data.reaction ? (
                <Image
                  className="cursor-pointer scale-[1.15]"
                  width={50}
                  height={50}
                  src={reaction.toggledImage}
                  alt={reaction.text}
                />
              ) : (
                <Image
                  className="hover:scale-[1.15] cursor-pointer"
                  width={50}
                  height={50}
                  src={reaction.image}
                  alt={reaction.text}
                  onClick={() => {
                    setData("reaction", reaction.text);
                    setShowReactionError(false);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {showReactionError && (
          <p className="text-danger text-center text-sm mt-4 fw-bold">
            You need to select a reaction first!
          </p>
        )}
        <hr />
        <p className="text-center mt-2 mb-3 text-secondary text-sm">
          Please select your feedback category below.
        </p>
        <div className="text-center mt-2">
          <ButtonGroup className="mb-2">
            {["Suggestion", "Something is not quite right", "Compliment"].map(
              (item, index) => (
                <Button
                  key={index}
                  onClick={() => setData("type", item)}
                  variant="outline-purple"
                  active={data.type == item}
                >
                  <small>{item}</small>
                </Button>
              )
            )}
          </ButtonGroup>
        </div>
        <hr />
        <p className="text-secondary mb-2">Please leave your feedback below:</p>
        <textarea
          className="form-control"
          value={data.comment}
          onChange={(e) => setData("comment", e.target.value)}
          rows={5}
          placeholder="Your feedback here.."
        ></textarea>
        <div className="text-end mt-3">
          <Button
            variant="purple"
            type="button"
            onClick={onSubmit}
            className="rounded-1"
          >
            Submit
          </Button>
        </div>
      </Container>
    </PanelLayout>
  );
}
