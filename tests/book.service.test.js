const bookService = require("../src/book.service");
const booksProvider = require("../src/books-provider");
const emailService = require("../src/email.service");

describe("searchbooks", () => {
  describe("when one book matches search text", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => [
        {
          _id: 1,
          title: "test book",
          categories: ["Web development"],
          publishedDate: "2006-11-01T00:00:00.000-0700",
          price: 18,
          ordered: 5,
        },
      ]);

      emailService.sendMissingBookEmail = jest.fn();
    });
    it("should return 1 book", () => {
      const books = bookService.searchBooks("test");
      expect(books.length).toBe(1);
    });

    it("should return format Title name of the book", () => {
      const books = bookService.searchBooks("test");
      expect(books[0]).toMatchObject({
        title: "test book 2006",
      });
    });

    it("should not call send email", () => {
      bookService.searchBooks("test");
      expect(emailService.sendMissingBookEmail).not.toHaveBeenCalled();
    });
  });

  describe("when zero book matches search text", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => [
        {
          _id: 1,
          title: "test book",
          categories: ["Web development"],
          publishedDate: "2006-11-01T00:00:00.000-0700",
          price: 18,
          ordered: 5,
        },
      ]);

      emailService.sendMissingBookEmail = jest.fn();
    });

    it("should return 0", () => {
      const books = bookService.searchBooks("not");
      expect(books.length).toBe(0);
    });
    it("should call send email", () => {
      bookService.searchBooks("not");
      expect(emailService.sendMissingBookEmail).toHaveBeenCalled();
    });
  });
});

describe("getMostPopularBook", () => {
  describe("when two books are given", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => [
        {
          _id: 1,
          ordered: 100,
        },
        {
          _id: 2,
          ordered: 50,
        },
      ]);
    });

    it("should return book with higher order count", () => {
      const book = bookService.getMostPopularBook();
      expect(book._id).toBe(1);
    });
  });
});

describe("calculateDiscount", () => {
  describe("when  book is given with id", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => [
        {
          _id: 1,
          price: 100,
        },
      ]);
    });

    it("should return book price with 20% discount", () => {
      const price = bookService.calculateDiscount(1);
      expect(price).toBe(80);
    });
  });

  describe("when  book with given id not found", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => []);
    });

    it("should throw an Error ", () => {
      expect(() => bookService.calculateDiscount(1)).toThrow(
        "Book with such id not found"
      );
    });
  });
});

describe("calculateDiscountAsync", () => {
  describe("when  book is given with id", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => [
        {
          _id: 1,
          price: 100,
        },
      ]);
    });

    it("should return book price with 20% discount", async () => {
      const price = await bookService.calculateDiscountAsync(1);
      expect(price).toBe(80);
    });
  });

  describe("when  book with given id not found", () => {
    beforeEach(() => {
      booksProvider.getBooks = jest.fn(() => []);
    });

    it("should throw an Error ", () => {
      expect(
        async () => await bookService.calculateDiscountAsync(1)
      ).rejects.toThrow("Book with such id not found");
    });
  });
});
