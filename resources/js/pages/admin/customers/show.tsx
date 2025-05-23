import AppLayout from '@/layouts/app-layout';
import { Customer, Product, Transaction, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import dayjs from "dayjs";
import { FormEventHandler, useRef, useState } from 'react';
import { ChevronLeft, Edit3, Minus, Plus, Check, Settings2, LucideInfo, Equal, FilterIcon, CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { MoreDetails } from '@/components/more-details';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn, getBalanceColor } from '@/lib/utils';
import { useInitials } from '@/hooks/use-initials';
import TransactionDetails from '@/components/transaction-details';
import BalanceInfo from '@/components/balance-info';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns';
import DatePicker from "react-datepicker";

export default function Show({ customer, transactions, order_items, payment_method }: { customer: Customer; transactions: Transaction[]; order_items: Product[]; payment_method: string }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/admin/customers' },
    { title: customer.name, href: `/admin/customers/${customer.id}` },
  ];

  const updateBalance = useRef<HTMLInputElement>(null);
  const operatorButtons = useRef<HTMLInputElement>(null);
  const { data, setData, reset, clearErrors } = useForm<{ update_balance: number | string, operator: string }>({
    update_balance: '',
    operator: '',
  });

  const { errors } = usePage().props;
  const getInitials = useInitials();
  const [isProcessing, setIsProcessing] = useState(false);


  const updateBalanceForm: FormEventHandler = (e) => {
    // e.preventDefault();
    setIsProcessing(true);

    router.patch(route('update_balance', { id: customer.id }), {
      update_balance: data.update_balance,
      operator: data.operator
    }, {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setIsProcessing(false);
      },
      onError: (errors) => {
        setIsProcessing(false);
        console.log("Validation Errors:", errors); // Debugging
        operatorButtons.current?.focus();
        updateBalance.current?.focus();
      },
    });
  };

  const handleTransactionClick = (transaction: Transaction) => {

    if (transaction.type === 'order') {
      // Prepare the data to send with the request
      const requestData = {
        amount: transaction.amount,
        date: transaction.created_at,
      };

      // Send the request (you can use fetch, axios, or Inertia.js request)
      router.post(route('order-history', { id: customer.id }), requestData, {
        onSuccess: () => {
          console.log('Request successful');
        },
        onError: (errors) => {
          console.error('Error occurred:', errors);
        },
      });
    }
  };

  const closeModal = () => {
    clearErrors();
    reset();
  };

  // const [month, setMonth] = useState<Date | null>(null);
  // const filteredTransactions = transactions.filter((t) => {
  //   if (!month) return true;
  //   const tDate = new Date(t.created_at);
  //   return (
  //     tDate.getMonth() === month.getMonth() &&
  //     tDate.getFullYear() === month.getFullYear()
  //   );
  // });

  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredTransactions = transactions.filter((t) =>
    dayjs(t.created_at).format("YYYY-MM") === selectedMonth
  );



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${customer.name} | Customers`} />
      <div className="h-full flex flex-col gap-10 p-4">

        {/* Navigation Buttons */}
        <section className='flex gap-2 w-full justify-end'>
          <Link href={route("customers.index")}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <Link href={route("customers.edit", customer.id)}>
            <Button variant="default" size="sm">
              Edit Customer
              <Edit3 className="w-4 h-4" />
            </Button>
          </Link>
        </section>

        {/* Customer Details */}
        <section className="flex md:flex-row flex-col md:items-start items-center gap-5">
          {
            customer.image ? (
              <img
                src={customer.image ? `/storage/${customer.image}` : "/images/no_user.jpg"}
                alt={`${customer.name} image`}
                className="w-40 h-40 object-cover rounded-full"
                onError={(e) => (e.currentTarget.src = "/images/no_user.jpg")} // Handle broken images
              />
            ) : (
              <div>
                <div className="w-40 h-40 object-cover rounded-full flex items-center justify-center bg-black/70 dark:bg-[#404040] text-6xl text-white">
                  {getInitials(customer.name)}
                </div>
              </div>
            )
          }

          <div className='w-full *:p-5'>
            <section className='flex justify-between gap-5'>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>{customer.name}</p>
              </div>
            </section>

            {/* Outstanding Balance */}
            <section className='flex justify-between items-center flex-wrap gap-3 border-y'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  Outstanding Balance :
                  <span className={`font-semibold -ml-1 ${getBalanceColor(customer.balance)}`}>
                    ₱{Number(customer.balance).toLocaleString("en-PH")}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <LucideInfo className="w-4 h-4 cursor-pointer hover:opacity-70 opacity-90" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Balance Information</DialogTitle>
                      <BalanceInfo />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Update Balance Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' size='default'>
                    Update Balance
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Update Balance</DialogTitle>
                  <form className="space-y-4" onSubmit={updateBalanceForm}>
                    <div className='space-y-3 text-sm text-gray-500'>
                      <section>
                        Current Balance: <span className={`font-semibold ${getBalanceColor(customer.balance)}`}>
                          ₱ {Number(customer.balance).toLocaleString("en-PH")}
                        </span>
                      </section>

                      <section className='space-y-2'>
                        <p>
                          Select Operator:
                        </p>
                        <RadioGroup
                          aria-labelledby="operator-label"
                          id='operator'
                          className='text-black/80 dark:text-white'
                          value={data.operator}
                          onValueChange={(value) => setData('operator', value)} // Update state when value changes
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="add" id="r1" />
                            <Label htmlFor="r1" className='cursor-pointer flex items-center gap-1'>
                              Borrow
                              <Plus className='w-4 h-4' />
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="subtract" id="r2" />
                            <Label htmlFor="r2" className='cursor-pointer flex items-center gap-1'>
                              Pay
                              <Minus className='w-4 h-4' />
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="adjust" id="r3" />
                            <Label htmlFor="r3" className='cursor-pointer flex items-center gap-1'>
                              Adjust
                              <Equal className='w-4 h-4' />
                            </Label>
                          </div>
                        </RadioGroup>
                      </section>
                    </div>

                    <div className="grid gap-2">
                      <section className='flex items-center gap-2'>
                        ₱
                        <Input
                          id="update_balance"
                          type='number'
                          step='0.01'
                          name="update_balance"
                          ref={updateBalance}
                          value={data.update_balance}
                          onChange={(e) => setData('update_balance', e.target.value)}
                          placeholder="0.00"
                          autoComplete=''
                        />
                      </section>
                      <InputError message={errors?.update_balance} />
                    </div>

                    {data.update_balance ?
                      (
                        data.operator ? (
                          <section className="space-y-2 text-sm">
                            <p>Updated Balance :
                              <span className="font-semibold ml-1">
                                ₱ {data.operator === 'add'
                                  ? (Number(customer.balance) + Number(data.update_balance)).toLocaleString("en-PH")
                                  : data.operator === 'subtract'
                                    ? (Number(customer.balance) - Number(data.update_balance)).toLocaleString("en-PH")
                                    : (Number(data.update_balance)).toLocaleString("en-PH")}
                              </span>
                            </p>
                          </section>
                        ) : (
                          <p className='text-sm text-yellow-600'>Please select an operator.</p>
                        )
                      ) : (
                        null
                      )
                    }

                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" onClick={closeModal}>
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button type='submit' variant="default" disabled={!data.update_balance || !data.operator || isProcessing}>
                        Update
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </section>

            {/* Transaction History */}
            {
              transactions.length != 0 &&
              <section className="flex flex-col gap-3">
                <div className='flex justify-between items-end'>
                  <section className='font-semibold flex items-start gap-1'>
                    <p>Transaction History</p>
                    <span className='text-xs'>
                      {customer && customer.transactions_count != null && customer.transactions_count > 0
                        ? customer.transactions_count
                        : null}
                    </span>
                  </section>
                  <section>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </section>
                </div>
                <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-accent rounded-lg  overflow-y-auto overflow-x-hidden max-h-60'>
                  {
                    filteredTransactions.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">
                        No Transactions Found.
                      </div>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <Dialog key={transaction.id}>
                          <DialogTrigger asChild>
                            <div
                              className="flex md:flex-row flex-col w-full md:justify-between md:items-start md:gap-2 py-2 cursor-pointer"
                              onClick={() => handleTransactionClick(transaction)}
                            >
                              <section className="flex items-start gap-1">
                                <div className="text-sm mt-0.5">
                                  {transaction.status === "paid" ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : transaction.type === "borrow" || transaction.status === "pending" ? (
                                    <Plus className="w-4 h-4 text-red-500" />
                                  ) : null}
                                </div>
                                <div>
                                  <p className="text-sm truncate">{transaction.message}</p>
                                  <p className="font-semibold">
                                    {`₱${Number(transaction.amount).toLocaleString("en-PH")}`}
                                  </p>
                                </div>
                              </section>
                              <section className="font-medium text-xs text-end space-y-2">
                                <h1 className="text-sm text-black dark:text-white md:block hidden">
                                  <span className="text-gray-500">Updated Balance:</span>{" "}
                                  {`₱${Number(transaction.updated_balance).toLocaleString("en-PH")}`}
                                </h1>
                                <p>@ {dayjs(transaction.created_at).format("MMM DD, YYYY")}</p>
                              </section>
                            </div>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogTitle>Transaction Details</DialogTitle>
                            <TransactionDetails
                              payment_method={payment_method}
                              transaction={transaction}
                              order_items={order_items}
                            />
                          </DialogContent>
                        </Dialog>
                      ))
                    )
                  }
                </div>
              </section>
            }

            {/* More Details */}
            <section className="flex flex-col gap-3">
              <h1 className='font-semibold'>More Details</h1>
              <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg overflow-hidden'>
                <MoreDetails label="Customer ID" value={String(customer.id)} />
                <MoreDetails label="Contact No." value={customer.phone ? customer.phone : 'N/A'} />
                <MoreDetails label="Address" value={customer.address} />
                <MoreDetails label="Date Joined" value={dayjs(customer.created_at).format('MMM DD, YYYY | hh:mm a')} />
                <MoreDetails label="Last Update" value={dayjs(customer.updated_at).format('MMM DD, YYYY | hh:mm a')} />
              </div>
            </section>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
