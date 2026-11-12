import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const fiction = await prisma.genre.create({
    data: { name: 'Fiction', description: 'Novels and short stories' },
  });
  const scifi = await prisma.genre.create({
    data: { name: 'Science Fiction', description: 'Speculative and futuristic fiction' },
  });
  const nonfiction = await prisma.genre.create({
    data: { name: 'Non-Fiction', description: 'Factual and informative works' },
  });
  const fantasy = await prisma.genre.create({
    data: { name: 'Fantasy', description: 'Magic, myth and imagined worlds' },
  });

  await prisma.book.createMany({
    data: [
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960, copiesAvailable: 3, genreId: fiction.id },
      { title: '1984', author: 'George Orwell', publishedYear: 1949, copiesAvailable: 4, genreId: fiction.id },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publishedYear: 1925, copiesAvailable: 2, genreId: fiction.id },
      { title: 'Things Fall Apart', author: 'Chinua Achebe', publishedYear: 1958, copiesAvailable: 3, genreId: fiction.id },

      { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, copiesAvailable: 3, genreId: scifi.id },
      { title: 'Neuromancer', author: 'William Gibson', publishedYear: 1984, copiesAvailable: 2, genreId: scifi.id },
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', publishedYear: 1969, copiesAvailable: 2, genreId: scifi.id },
      { title: 'Foundation', author: 'Isaac Asimov', publishedYear: 1951, copiesAvailable: 3, genreId: scifi.id },

      { title: 'Sapiens', author: 'Yuval Noah Harari', publishedYear: 2011, copiesAvailable: 5, genreId: nonfiction.id },
      { title: 'Educated', author: 'Tara Westover', publishedYear: 2018, copiesAvailable: 2, genreId: nonfiction.id },
      { title: 'The Immortal Life of Henrietta Lacks', author: 'Rebecca Skloot', publishedYear: 2010, copiesAvailable: 2, genreId: nonfiction.id },
      { title: 'Atomic Habits', author: 'James Clear', publishedYear: 2018, copiesAvailable: 4, genreId: nonfiction.id },

      { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, copiesAvailable: 4, genreId: fantasy.id },
      { title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', publishedYear: 1997, copiesAvailable: 5, genreId: fantasy.id },
      { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', publishedYear: 1968, copiesAvailable: 2, genreId: fantasy.id },
      { title: 'The Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007, copiesAvailable: 3, genreId: fantasy.id },
    ],
  });

  const patron = await prisma.user.create({
    data: { email: 'patron@library.test', name: 'Pat Reader', role: Role.PATRON },
  });
  await prisma.user.create({
    data: { email: 'librarian@library.test', name: 'Lee Brarian', role: Role.LIBRARIAN },
  });

  const dune = await prisma.book.findFirstOrThrow({ where: { title: 'Dune' } });
  await prisma.review.create({
    data: { bookId: dune.id, userId: patron.id, rating: 5, comment: 'A masterpiece.' },
  });

  console.log('Seed complete: 4 genres, 16 books, 2 users, 1 review');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
