import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import moment from "moment";
import { Button, Table } from "@mantine/core";
import api from "../../middleware/api";
import { useAuth } from "../../hooks/auth";
import { useEffect, useState } from "react";
import { TextInput } from "@mantine/core";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AxiosResponse } from "axios";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [selectedItem, setSelectedItem] = useState<NoteType | null>(null);

  useEffect(() => {
    (async () => {
      await getNotes();
    })();
  }, []);

  const getNotes = async () => {
    await api.get("/sanctum/csrf-cookie");
    const res = await api.get("/api/note");

    if (res.data && res.data.length > 0) setNotes(res.data);
    console.log(notes);
  };

  const handleDelete = async (id: number | null) => {
    try {
      let res = await api.delete(`/api/note/${id}`);
      console.log(res.data);
      await getNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<NoteType>({ defaultValues: { desc: "", id: null } });

  const onSubmit: SubmitHandler<NoteType> = async (data: NoteType) => {
    await api.get("/sanctum/csrf-cookie");

    let res: AxiosResponse<any, any, {}>;
    if (selectedItem) {
      //update
      res = await api.put(`/api/note/${data.id}`, data);
    } else {
      //new
      res = await api.post("/api/note", data);
    }

    await getNotes();
    reset();
    setSelectedItem(null);
  };

  //Logout Functionality
  const { user, refetchUser } = useAuth();
  const logout = async (): Promise<void> => {
    await api.get("/api/logout");
    refetchUser();
  };

  const columns: ColumnDef<NoteType>[] = [
    {
      header: "Note ID",
      accessorKey: "id",
    },
    {
      header: "Description",
      accessorKey: "desc",
    },
    {
      header: "Created at",
      cell: ({ row }) => {
        return moment(row.original.created_at).format("MM/DD/YY");
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <>
            <Button
              onClick={() => {
                setSelectedItem(row.original);
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                handleDelete(row.original.id);
              }}
              color="red"
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: notes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectedItem) {
      setValue("desc", selectedItem?.desc);
      setValue("id", selectedItem.id);
      console.log(selectedItem);
    }
  }, [selectedItem]);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => logout()}>
        Logout
      </Button>
      <h1>
        Welcome <em>{user?.name}</em>! #{user?.id}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput label="Add a note" {...register("desc")} required />
        {errors.desc && <span>This field is required</span>}
        <Button
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          {selectedItem ? "Update" : "Submit"}
        </Button>
        {selectedItem && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedItem(null);
              reset();
            }}
          >
            Cancel
          </Button>
        )}
      </form>
      <Table verticalSpacing={0} stickyHeader>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Th key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Table.Td
                      key={cell.id}
                      style={{
                        width: "1%",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            );
          })}
          {table.getRowModel().rows.length === 0 && (
            <Table.Tr>
              <Table.Td
                colSpan={table.getHeaderGroups()[0]?.headers.length}
                style={{ textAlign: "center" }}
              >
                No Item
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
};

type NoteType = {
  id: number | null;
  desc: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};
export default Home;
