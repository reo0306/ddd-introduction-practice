import express, { json, Response } from 'express';
import "reflect-metadata";
import { container } from "tsyringe";

import {
    RegisterBookCommand,
    RegisterBookService,
} from "Application/Book/RegisterBookService/RegisterBookService";

import {
    AddReviewCommand,
    AddReviewService,
} from "Application/Review/AddReviewService/AddReviewService";
import {
    DeleteReviewCommand,
    DeleteReviewService,
} from "Application/Review/DeleteReviewService/DeleteReviewService";
import {
    EditReviewCommand,
    EditReviewService,
} from "Application/Review/EditReviewService/EditReviewService";
import {
    GetRecommendedBooksCommand,
    GetRecommendedBooksService,
} from "Application/Review/GetRecommendedBooksService/GetRecommendedBooksService";

import "../../Program";

const app = express();
const port = 3000;

app.use(json());

const isStr = (v: any): v is string => typeof v === 'string' && v.length > 0;
const isNum = (v: any): v is number => typeof v === 'number' && !isNaN(v);
const invalid = (res: Response) => res.status(400).json({ ok: false, message: 'Invalid request' });

app.get('/book/:isbn/recommendations', async (req, res) => {
  try {
    const { isbn } = req.params;
    const { maxCount } = req.query;
    
    if (!isStr(isbn)) {
      return invalid(res);
    }
    if (maxCount && isNaN(Number(maxCount))) {
        return invalid(res);
    }

    const getRecommendedBooksService = container.resolve(GetRecommendedBooksService);

    const command: GetRecommendedBooksCommand = {
        bookId: isbn,
        maxCount: maxCount ? Number(maxCount) : undefined,
    };

    const recommendedBooks = await getRecommendedBooksService.execute(command);

    res.status(200).json({ ok: true, recommendedBooks });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
});

app.post("/book", async (req, res) => {
    try {
        const { isbn, title, author, price } = req.body;

        if (!isStr(isbn) || !isStr(title) || !isStr(author) || !isNum(price)) {
            return invalid(res);
        }

        const registerBookService = container.resolve(RegisterBookService);
        const command: RegisterBookCommand = {
            isbn,
            title,
            author,
            price,
        };
        const book = await registerBookService.execute(command);
        res.status(201).json({ ok: true, book });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

app.post("/book/:isbn/review", async (req, res) => {
    try {
        const { isbn } = req.params;
        const { name, rating, comment } = req.body;

        if (!isStr(isbn) || !isStr(name) || !isNum(rating)) {
            return invalid(res);
        }

        const addReviewService = container.resolve(AddReviewService);
        const command: AddReviewCommand = {
            bookId: isbn,
            name,
            rating,
            comment,
        };
        const review = await addReviewService.execute(command);
        res.status(201).json({ ok: true, review });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

app.put("/review/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { name, rating, comment } = req.body;

        if (!isStr(reviewId)) {
            return invalid(res);
        }

        if (name && !isStr(name)) {
            return invalid(res);
        }
        if (rating && !isNum(rating)) {
            return invalid(res);
        }
        if (comment && !isStr(comment)) {
            return invalid(res);
        }

        const editReviewService = container.resolve(EditReviewService);
        const command: EditReviewCommand= {
            reviewId,
            name,
            rating,
            comment,
        };
        const review = await editReviewService.execute(command);
        res.status(200).json({ ok: true, review });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

app.delete("/review/:reviewId", async (req, res) => {
    try {
        const { reviewId } = req.params;
        
        if (!isStr(reviewId)) {
            return invalid(res);
        }

        const deleteReviewService = container.resolve(DeleteReviewService);
        const command: DeleteReviewCommand = {
            reviewId,
        };
        await deleteReviewService.execute(command);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});