import AppLayout from '@/layouts/app-layout';
import { Customer, Flash, type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import dayjs from "dayjs";
import { FormEventHandler, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, Edit3, Minus, Plus } from "lucide-react";
import { MoreDetails } from '@/components/more-details';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Show({ customer }: { customer: Customer }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/admin/customers' },
    { title: customer.name, href: `/admin/customers/${customer.id}` },
  ];

  const updateBalance = useRef<HTMLInputElement>(null);
  const operatorButtons = useRef<HTMLInputElement>(null);
  const { data, setData, patch, reset, clearErrors, processing } = useForm<{ update_balance: number | string, operator: string }>({
    update_balance: '',
    operator: '',
  });
  const { errors } = usePage().props;

  const updateBalanceForm: FormEventHandler = (e) => {
    e.preventDefault();

    router.patch(route('update_balance', customer.id), {
      update_balance: data.update_balance,
      operator: data.operator
    }, {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: (errors) => {
        console.log("Validation Errors:", errors); // Debugging
        operatorButtons.current?.focus();
        updateBalance.current?.focus();
      },
    });
  };


  const closeModal = () => {
    clearErrors();
    reset();
  };

  const { flash } = usePage<{ flash: Flash }>().props;
  useEffect(() => {
    if (flash.update) {
      toast.info(flash.update);
    } else if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const getBalanceColor = (balance: number) => {
    if (balance <= 150) return "text-green-500";
    if (balance <= 999) return "text-blue-500";
    if (balance >= 1000) return "text-red-500";
    return "";
  };

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
              Edit Account
              <Edit3 className="w-4 h-4" />
            </Button>
          </Link>
        </section>

        {/* Customer Details */}
        <section className="flex md:flex-row flex-col md:items-start items-center gap-5">
          <img
            src={customer.image ? `/storage/${customer.image}` : "/images/no_image.jpeg"}
            alt={`${customer.name} image`}
            className="w-1/4 h-fit rounded-lg object-cover"
            onError={(e) => (e.currentTarget.src = "/images/no_image.jpeg")}
          />

          <div className='w-full divide-y *:p-5'>
            <section className='flex justify-between gap-5'>
              <div className='space-y-1'>
                <p className='text-2xl font-bold'>{customer.name}</p>
              </div>
            </section>

            {/* Outstanding Balance */}
            <section className='flex justify-between items-center flex-wrap gap-3'>
              <div className='space-y-1'>
                <p className=''>Outstanding Balance :
                  <span className={`font-semibold ml-1.5 ${getBalanceColor(customer.balance)}`}>
                    ₱ {Number(customer.balance).toLocaleString("en-PH")}
                  </span>
                </p>
              </div>

              {/* Update Balance Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='secondary' size='default'>
                    Update Balance
                    <Minus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>

                  <form className="space-y-4" onSubmit={updateBalanceForm}>
                    <DialogTitle>Update Balance</DialogTitle>
                    <DialogDescription>
                      <div className='space-y-3'>
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
                            id='operator'
                            className='flex gap-5 items-center'
                            value={data.operator}
                            onValueChange={(value) => setData('operator', value)} // Update state when value changes
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="add" id="r1" />
                              <Label htmlFor="r1" className='flex items-center gap-1 cursor-pointer'>
                                Add
                                <Plus className='w-4 h-4' />
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="subtract" id="r2" />
                              <Label htmlFor="r2" className='flex items-center gap-1 cursor-pointer'>
                                Subtract
                                <Minus className='w-4 h-4' />
                              </Label>
                            </div>
                          </RadioGroup>
                        </section>
                      </div>
                    </DialogDescription>

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
                                  : (Number(customer.balance) - Number(data.update_balance)).toLocaleString("en-PH")}
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
                        <Button variant="secondary" onClick={closeModal}>
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button type='submit' variant="default" disabled={processing}>
                        Update
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </section>

            {/* Transaction History */}
            <section className="flex flex-col gap-3">
              <h1 className='font-semibold'>Transaction History</h1>
              <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg divide-y overflow-y-auto overflow-x-hidden h-60'>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
              </div>
            </section>

            {/* More Details */}
            <section className="flex flex-col gap-3">
              <h1 className='font-semibold'>More Details</h1>
              <div className='*:p-5 *:text-gray-700 *:dark:text-gray-300 border *:hover:bg-gray-50 *:dark:hover:bg-black rounded-lg divide-y overflow-hidden'>
                <MoreDetails label="Customer ID" value={String(customer.id)} />
                <MoreDetails label="Contact No." value={customer.phone} />
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
