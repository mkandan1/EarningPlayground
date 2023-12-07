import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../FirebaseConfig';
import { get, ref } from 'firebase/database';
import { MaterialReactTable, useMaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Box } from '@mui/material';
import { FaLock } from 'react-icons/fa';

type Payment = {
    date: string;
    amount: number;
    status: string;
};

export const Withdraw = () => {
    const [inviteCount, setInviteCount] = useState(0);
    const [history, setHistory]: any[] = useState([]);



    const columns: MRT_ColumnDef<Payment>[] = [
        {
            accessorKey: 'date',
            header: 'Date',
            size: 150,
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            size: 150,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 150,
            Cell: ({ cell }) => (
                <Box
                    component="span"
                    sx={(theme) => ({
                        background: cell.getValue<string>() === 'Approved' ? theme.palette.success.dark : theme.palette.warning.dark,
                        borderRadius: '0.25rem',
                        color: '#fff',
                        maxWidth: '9ch',
                        p: '0.25rem',
                    })}
                >
                    {cell.getValue<string>()}
                </Box>
            ),
        },
    ];


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;

                const userDataRef = ref(db, 'Users/' + uid);

                get(userDataRef).then((snapshot) => {
                    if (snapshot.exists()) {

                        const count = snapshot.val().invite_count;
                        const userPaymentHistroy = snapshot.val().payment_history;
                        setInviteCount(count);

                        let newPaymentData = [];
                        for (let payment in userPaymentHistroy) {
                            newPaymentData.push(userPaymentHistroy[payment]);
                        }

                        setHistory(newPaymentData);
                    }
                });
            }
        });
    }, []);

    const table = useMaterialReactTable({
        columns,
        data: history, // Corrected from 'history' to 'data'
    });



    return (
        <div className="w-full h-screen">
            {inviteCount >= 3 && history.length > 0 ? (
                <>
                    <div className="pt-52 px-20">
                        <h3 className="font-manrope text-lg font-semibold mb-5">Payment History</h3>
                        <MaterialReactTable table={table} />
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full h-full flex justify-center pt-80">
                        <div className="flex items-center flex-col text-center gap-y-3">
                            <FaLock className="text-yellow-500 text-5xl" />
                            <h4 className='font-manrope font-medium'>You're payments are on hold</h4>
                            <h1 className='text-xl font-poppins'>Invite <span className='text-indigo-500'>3 friends</span> to get your first payment</h1>
                            <p className='font-manrope'>Don't worry we will your money on the payment date</p>
                            
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};
