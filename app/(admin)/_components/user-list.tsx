import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  
  type User = {
    id: string
    name: string | null
    email: string
    phoneNumber: string
    role: string
    createdAt: Date
    _count: {
      subscriptions: number
    }
  }
  
  export function UserList({ users }: { users: User[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow className='min-w-fit px-1'>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Subscriptions</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user._count.subscriptions}</TableCell>
              <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }