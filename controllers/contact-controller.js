import { v4 as uuidv4 } from "uuid";
import db from "../configs/db.js";
const tableName = "contacts";

export const storeContact = (req, res) => {
  const { name, phone_number, email } = req.body;
  const id = uuidv4();
  const insertQuery = `
    INSERT INTO ${tableName} (id, name, phone_number, email) 
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  db.query(insertQuery, [id, name, phone_number, email], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to store contact!",
        status: 500,
        error: err.message,
      });
    }

    return res.status(200).json({
      message: "ELLAH BEAUTIFUL EYES SUCCESSFULLAY!",
      status: 200,
      data: {
        contact: result.rows,
      },
    });
  });
};

export const indexContacts = (req, res) => {
  const selectQuery = `SELECT * FROM ${tableName} ORDER BY name ASC`;

  db.query(selectQuery, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to index contacts!",
        status: 500,
        error: err.message,
      });
    } else {
      return res.status(200).json({
        message: "ELLAH BEAUTIFUL EYES SUCCESSFULLAY! EYYYYY",
        status: 200,
        data: {
          contacts: result.rows,
        },
      });
    }
  });
};

export const showContact = (req, res) => {
  const { id } = req.params;
  console.log("show id: ", req);

  const selectQuery = `SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1`;

  db.query(selectQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch contact!",
        status: 500,
        data: { contacts: [] },
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Contact not found!",
        status: 404,
        data: { contacts: [] },
      });
    }

    return res.status(200).json({
      message: "Contact fetched successfully!",
      status: 200,
      data: {
        contacts: result.rows,
      },
    });
  });
};

export const updateContact = (req, res) => {
  const { id } = req.params;
  const { name, phone_number, email } = req.body;
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (name) {
    fields.push(`name = $${paramIndex++}`);
    values.push(name);
  }
  if (phone_number) {
    fields.push(`phone_number = $${paramIndex++}`);
    values.push(phone_number);
  }
  if (email) {
    fields.push(`email = $${paramIndex++}`);
    values.push(email);
  }

  if (fields.length === 0) {
    return res.status(400).json({
      message: "No fields provided to update",
      status: 400,
    });
  }

  if (id) {
    values.push(id);
  }

  const updateQuery = `
    UPDATE ${tableName}
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update contact!",
        status: 500,
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Contact not found!",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Contact updated successfully!",
      status: 200,
      data: {
        contact: result.rows[0],
      },
    });
  });
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const arrayId = [id];

  const deleteQuery = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;

  db.query(deleteQuery, arrayId, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete a contact!",
        status: 500,
        error: err.message,
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Contact not found!",
        status: 404,
        data: { contacts: [] },
      });
    }

    return res.status(200).json({
      message: "Contact deleted successfully!",
      status: 200,
      data: {
        contacts: result.rows[0],
      },
    });
  });
};
