import { MultipartHeader } from "@/constants/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Placeholder, Spinner } from "react-bootstrap";
import CommentsArea from "./CommentsArea";
import Pusher from "pusher-js";

const AddCommentForm = ({
  comment,
  setComment,
  addComment,
  submittingComment = false,
}) => (
  <Form
    onSubmit={(e) => {
      e.preventDefault();
      addComment(comment);
    }}
  >
    <div className="flex items-start">
      <textarea
        placeholder="Add private comment"
        rows={2}
        value={comment}
        required
        className="form-control !text-sm"
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      {submittingComment ? (
        <Spinner variant="primary" size="sm" />
      ) : (
        <button
          type="submit"
          disabled={comment.length == 0}
          className="border-0 btn btn-white"
        >
          <i className="bx bx-send fs-5 text-success"></i>
        </button>
      )}
    </div>
  </Form>
);

const CommentsView = ({
  user,
  submissionBin,
  unitHead,
  className = "",
  report,
}) => {
  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(true);
  const [addingComments, setAddingComments] = useState(false);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  console.log("report ", report);

  const fetchComments = (commentsData) => {
    axios
      .get(
        route("comments.unit_head.sub_bin_id.index", [
          unitHead.id,
          submissionBin.id,
        ])
      )
      .then((res) => {
        setIsFetchingComments(false);
        if (
          JSON.stringify(commentsData) !== JSON.stringify(res.data.comments)
        ) {
          setComments(res.data.comments);
        }
      })
      .catch((err) => console.log(err));
  };
  const addComment = (comment) => {
    setSubmittingComment(true);
    var formData = new FormData();
    formData.append("comment", comment);
    formData.append("user_id", user.id);
    formData.append("report_id", report.id);
    formData.append("unit_head_id", unitHead.id);
    formData.append("submission_bin_id", submissionBin.id);

    axios.post(route("comments.add"), formData, MultipartHeader).then((res) => {
      setSubmittingComment(false);
      setComment("");
      fetchComments();
      console.log(res);
      // console.log('add comment: ', res)
    });
  };

  useEffect(() => {
    fetchComments();
    const channelName = `private-comments.${submissionBin.id}.${unitHead.id}`;

    var pusher = new Pusher("19a0335a19628a91e19f", {
      cluster: "ap1",
      authEndpoint: "/broadcasting/auth",
    });

    var channel = pusher.subscribe(channelName);
    channel.bind("new-comment", function (data) {
      // setComments(comments => ([...comments, data.reportComment]));
      fetchComments();
    });
  }, []);

  return (
    <div className={`${className}`}>
      {isFetchingComments ? (
        <div className="flex gap-2">
          <Placeholder animation="wave">
            <div className="w-[40px] h-[40px] bg-light rounded-full"></div>
          </Placeholder>
          <div className="flex-grow-1">
            <Placeholder animation="wave" className="">
              <Placeholder xs={1} bg="light" className="" />
            </Placeholder>
            <Placeholder animation="wave" className="">
              <Placeholder xs={12} bg="light" className="" />
            </Placeholder>
          </div>
        </div>
      ) : comments.length > 0 ? (
        <>
          <CommentsArea comments={comments} user={user} />
          <div className="mt-2">
            <AddCommentForm
              comment={comment}
              addComment={addComment}
              setComment={setComment}
              submittingComment={submittingComment}
            />
          </div>
        </>
      ) : addingComments ? (
        <AddCommentForm
          comment={comment}
          addComment={addComment}
          setComment={setComment}
          submittingComment={submittingComment}
        />
      ) : report == null ? (
        // <p
        //   className="text-sm cursor-pointer text-primary"
        //   onClick={() => setAddingComments(true)}
        // >
        //   Add private comments
        // </p>
        // check if report is null
        <p className="text-sm text-slate-500">Create a report first</p>
      ) : (
        <p
          className="text-sm cursor-pointer text-primary"
          onClick={() => setAddingComments(true)}
        >
          Add private comments
        </p>
      )}
    </div>
  );
};

export default CommentsView;
