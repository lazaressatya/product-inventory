import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


/*
  GET
  Fetch all products
*/

export async function GET() {
  try {

    const client = await clientPromise;

    const db = client.db("inventory_db");

    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(products);

  } catch (error) {

    console.error("GET PRODUCTS ERROR:", error);

    return Response.json(
      {
        error: "Failed to fetch products"
      },
      {
        status: 500
      }
    );
  }
}


/*
  POST
  Create product
*/

export async function POST(request) {
  try {

    const body = await request.json();

    if (
      !body.name ||
      !body.category ||
      body.price === undefined ||
      body.quantity === undefined
    ) {
      return Response.json(
        {
          error: "Required fields are missing"
        },
        {
          status: 400
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("inventory_db");

    const product = {
      name: body.name,
      description: body.description || "",
      price: Number(body.price),
      category: body.category,
      quantity: Number(body.quantity),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db
      .collection("products")
      .insertOne(product);

    return Response.json(
      {
        message: "Product created successfully",
        product: {
          _id: result.insertedId,
          ...product
        }
      },
      {
        status: 201
      }
    );

  } catch (error) {

    console.error("CREATE PRODUCT ERROR:", error);

    return Response.json(
      {
        error: "Failed to create product"
      },
      {
        status: 500
      }
    );
  }
}


/*
  PUT
  Update product
*/

export async function PUT(request) {
  try {

    const body = await request.json();

    if (!body.id) {
      return Response.json(
        {
          error: "Product ID is required"
        },
        {
          status: 400
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("inventory_db");

    const result = await db
      .collection("products")
      .updateOne(
        {
          _id: new ObjectId(body.id)
        },
        {
          $set: {
            name: body.name,
            description: body.description || "",
            price: Number(body.price),
            category: body.category,
            quantity: Number(body.quantity),
            updatedAt: new Date()
          }
        }
      );

    return Response.json({
      message: "Product updated successfully",
      modifiedCount: result.modifiedCount
    });

  } catch (error) {

    console.error("UPDATE PRODUCT ERROR:", error);

    return Response.json(
      {
        error: "Failed to update product"
      },
      {
        status: 500
      }
    );
  }
}


/*
  DELETE
  Delete product
*/

export async function DELETE(request) {
  try {

    const body = await request.json();

    if (!body.id) {
      return Response.json(
        {
          error: "Product ID is required"
        },
        {
          status: 400
        }
      );
    }

    const client = await clientPromise;

    const db = client.db("inventory_db");

    const result = await db
      .collection("products")
      .deleteOne({
        _id: new ObjectId(body.id)
      });

    return Response.json({
      message: "Product deleted successfully",
      deletedCount: result.deletedCount
    });

  } catch (error) {

    console.error("DELETE PRODUCT ERROR:", error);

    return Response.json(
      {
        error: "Failed to delete product"
      },
      {
        status: 500
      }
    );
  }
}