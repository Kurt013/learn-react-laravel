import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import moment from "moment";
import {
  Button,
  Table,
  Container,
  Stack,
  TextInput,
  Card,
  Group,
  Title,
  Text,
  ActionIcon,
  Badge,
  Flex,
} from "@mantine/core";
import { IconTrash, IconEdit, IconLogout } from "@tabler/icons-react";
import api from "../../middleware/api";
import { useAuth } from "../../hooks/auth";
import { useEffect, useState } from "react";
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
      header: "ID",
      accessorKey: "id",
      size: 50,
    },
    {
      header: "Note",
      accessorKey: "desc",
    },
    {
      header: "Created",
      cell: ({ row }) => {
        return (
          <Text size="sm" c="dimmed">
            {moment(row.original.created_at).format("MMM DD, YYYY")}
          </Text>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Group gap="xs" justify="flex-end">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setSelectedItem(row.original);
              }}
              title="Edit"
            >
              <IconEdit size={18} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => {
                handleDelete(row.original.id);
              }}
              title="Delete"
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
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
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header Section */}
        <Flex justify="space-between" align="center">
          <div>
            <Title order={1} size="h2" fw={700}>
              My Notes
            </Title>
            <Text c="dimmed" size="sm" mt="xs">
              Welcome back, <strong>{user?.name}</strong>
            </Text>
          </div>
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => logout()}
            title="Logout"
          >
            <IconLogout size={24} />
          </ActionIcon>
        </Flex>

        {/* Add/Edit Note Form */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="md">
            <Title order={3} size="h5">
              {selectedItem ? "Edit Note" : "Add New Note"}
            </Title>
          </Card.Section>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Note"
                placeholder="Write your note here..."
                {...register("desc", { required: "Note is required" })}
                error={errors.desc?.message}
                radius="md"
                size="md"
              />

              <Group justify="flex-end" gap="xs">
                <Button
                  variant="default"
                  onClick={() => {
                    setSelectedItem(null);
                    reset();
                  }}
                  style={{ display: selectedItem ? "block" : "none" }}
                >
                  Cancel
                </Button>
                <Button type="submit" radius="md">
                  {selectedItem ? "Update Note" : "Add Note"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        {/* Notes Table */}
        <Card shadow="sm" padding={0} radius="md" withBorder>
          {notes.length > 0 ? (
            <Table striped highlightOnHover stickyHeader>
              <Table.Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.Th key={header.id} colSpan={header.colSpan}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Thead>
              <Table.Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Stack align="center" justify="center" py="xl">
              <Text c="dimmed" size="md">
                No notes yet. Create your first note to get started!
              </Text>
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
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
