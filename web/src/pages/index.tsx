import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  total: number;
  page: number;
  limit: number;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const page = ctx.query.page || "1";
  const limit = ctx.query.limit || "10";

  try {
    const res = await fetch(`http://localhost:3000/users?page=${page}&limit=${limit}`, { method: "GET" });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], total: 0, page: 1, limit: 10 } };
    }

    const responseData = await res.json();

    return {
      props: {
        statusCode: 200,
        users: responseData.data,
        total: responseData.total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      },
    };
  } catch (e) {
    return { props: { statusCode: 500, users: [], total: 0, page: 1, limit: 10 } };
  }
};

function generatePaginationItems(page: number, total: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  let items = [];

  let visiblePages = 10;
  let startPage = page - Math.floor(visiblePages / 2);
  if (startPage < 1) {
    startPage = 1;
  }
  let endPage = startPage + visiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = endPage - visiblePages + 1;
    if (startPage < 1) {
      startPage = 1;
    }
  }

  items.push(<Pagination.First key={"first"} href={`/?page=1&limit=${limit}`} disabled={page === 1} />);

  items.push(<Pagination.Prev key={"prev"} href={`/?page=${page - 1}&limit=${limit}`} disabled={page === 1} />);

  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <Pagination.Item key={i} href={`/?page=${i}&limit=${limit}`} active={i === page}>
        {i}
      </Pagination.Item>
    );
  }

  items.push(
    <Pagination.Next key={"next"} href={`/?page=${page + 1}&limit=${limit}`} disabled={page === totalPages} />
  );

  items.push(
    <Pagination.Last key={"last"} href={`/?page=${totalPages}&limit=${limit}`} disabled={page === totalPages} />
  );

  return items;
}

export default function Home({ statusCode, users, total, page, limit }: TGetServerSideProps) {
  if (statusCode !== 200 || !users || !users.length) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>{generatePaginationItems(page, total, limit)}</Pagination>
        </Container>
      </main>
    </>
  );
}
