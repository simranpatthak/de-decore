import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "../../store/slices/addressSlice";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from "../../components/ui/dialog";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const AddressBook = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ street: "", city: "", state: "", country: "", zip: "" });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editMode) {
        await dispatch(updateAddress({ id: editId, addressData: formData })).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addAddress(formData)).unwrap();
        toast.success("Address added successfully");
      }
      setModalOpen(false);
      setFormData({ street: "", city: "", state: "", country: "", zip: "" });
      setEditMode(false);
    } catch (error) {
      console.log(error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  };


  const handleEdit = (address) => {
    setFormData({ ...address });
    setEditMode(true);
    setEditId(address.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success("Address deleted successfully");
    }
  };

  return (
    <div className="p-6">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => { setEditMode(false); setFormData({ street: "", city: "", state: "", country: "", zip: "" }); }}>
            Add Address
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-96">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Label>Street</Label>
            <Input name="street" value={formData.street} onChange={handleChange} />
            {errors.street && <p className="text-red-500">{errors.street}</p>}

            <Label>City</Label>
            <Input name="city" value={formData.city} onChange={handleChange} />
            {errors.city && <p className="text-red-500">{errors.city}</p>}

            <Label>State</Label>
            <Input name="state" value={formData.state} onChange={handleChange} />
            {errors.state && <p className="text-red-500">{errors.state}</p>}

            <Label>Country</Label>
            <Input name="country" value={formData.country} onChange={handleChange} />
            {errors.country && <p className="text-red-500">{errors.country}</p>}

            <Label>Zip</Label>
            <Input name="zip" value={formData.zip} onChange={handleChange} />
            {errors.zip && <p className="text-red-500">{errors.zip}</p>}

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button type="submit" className="bg-green-500 text-white">{editMode ? "Update" : "Submit"}</Button>
              <DialogClose asChild>
                <Button type="button" className="bg-red-500 text-white">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p>Loading...</p>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4 relative shadow-lg border rounded-lg">
              <p><strong>Street:</strong> {address.street}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>State:</strong> {address.state}</p>
              <p><strong>Country:</strong> {address.country}</p>
              <p><strong>Zip:</strong> {address.zip}</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => handleEdit(address)} className="bg-blue-500 text-white flex items-center">
                  <AiFillEdit className="mr-1" /> Edit
                </Button>
                <Button onClick={() => handleDelete(address.id)} className="bg-red-500 text-white flex items-center">
                  <AiFillDelete className="mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>No address added yet!</p>
      )}
    </div>
  );
};

export default AddressBook;
