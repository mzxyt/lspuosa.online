import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Badge, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { formatDate } from "./Helper";

const RemindersCard = ({ className = "" }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = () => {
      axios.get("/reminders/all").then((res) => {
        setReminders(res.data.reminders);
      });
    };
  }, []);

  return (
    <Card className={`border-0 shadow-sm rounded-lg ${className}`}>
      <Card.Body className="p-4">
        <p className="fw-bold">Reminders</p>
        <ListGroup>
          {reminders.map((reminder, index) => (
            <ListGroupItem>
              <Badge bg="blue">
                {formatDate(new Date(reminder.created_at))}
              </Badge>
              <p>{reminder.content}</p>
            </ListGroupItem>
          ))}
        </ListGroup>
        {reminders.length == 0 && (
          <div className="border-[2px] border-slate-200 !border-dashed rounded-md py-8">
            <p className="text-sm text-slate-500 mb-0 text-center">
              Nothing to show.
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RemindersCard;
