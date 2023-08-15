import React, { useState, useRef } from 'react'
import { Card,
         Heading,
         CardBody,
         CardFooter,
         Text,
         Button,
         ButtonGroup,
         Progress,
         IconButton,
         Editable,
         EditableInput,
         EditablePreview,
         useToast,
         useDisclosure,
         AlertDialog,
         AlertDialogBody,
         AlertDialogOverlay,
         AlertDialogFooter,
         AlertDialogHeader,
         AlertDialogContent,
        } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom' 
import { GiTakeMyMoney } from 'react-icons/gi'
import { BiSolidEdit, BiCheck } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'
import { BsTrash3Fill } from 'react-icons/bs'

const CategoryCard = ({ category, fromBudget, categories, setCategories, handleDeleteCategoryCard, onDeleteCategory, editCategory }) => {
    const [open, setOpen] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingAmount, setIsEditingAmount] = useState(false)
    const [newCategory, setNewCategory] = useState(category)
    const navigate = useNavigate()
    const toast = useToast()
    const cancelRef = useRef()

    //initates accumulator for total spent
    let totalSpent = 0
    if(category){
        //adds amount of each expense to total spent accumulator
        category.expenses.forEach((expense) => totalSpent += expense.amount) //adds amount of each expense to total spent acculumater
    }

    function categoryLink(catId){
        navigate(`/categories/${catId}`)
      }
    
    function handleChangeCategoryTitle(e){
        setNewCategory({...newCategory, title: e.target.value})
    }

    function handleChangeCategoryAmount(e){
        setNewCategory({...newCategory, amount: e.target.value})
    }


    //CRUD functions
    function handleDeleteCategory(){
        fetch(`/categories/${category.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then((r) => {
            if(r.ok){
                r.json()
                fromBudget ? onDeleteCategory(category) : setCategories(categories?.filter((cat) => cat.id !== category.id))
                toast({
                    title: 'Deleted Category',
                    status: "success",
                    position: "top",
                    isClosable: true,
                })
            } else {
                r.json().then(e => toast({
                    title: `${r.status} ${e.error}`,
                    status: "error",
                    position: "top",
                    isClosable: true,
                    })
                )
            }
        })
    }

    function patchCategory(){
        fetch(`/categories/${category.id}`, {
            method: "PATCH",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(newCategory)
        })
        .then((r) => {
            if(r.ok){
                r.json()
                .then((newCat) => {
                const updatedCategories = categories?.map((cat) => {
                    if(cat.id === category.id){
                        cat = newCat
                        toast({
                            title: 'Updated Category',
                            status: "success",
                            position: "top",
                            isClosable: true,
                        })
                        setIsEditingTitle(false)
                        return cat
                    } else {
                        return cat
                    }
                })
                setNewCategory(newCat)
                setCategories(updatedCategories)
                setIsEditingAmount(false)
                setIsEditingTitle(false)
            })
            } else {
                r.json().then(e => toast({
                    title: `${r.status} ${e.error}`,
                    status: "error",
                    position: "top",
                    isClosable: true,
                    })
                    )
            }
        })
    }

  return (
        <>
            <Card className='budget'>
                <div className='progress-text'>
                        {isEditingTitle ? 
                            <Editable defaultValue={category.title} fontSize='md' mt='2'>
                            <div>
                                <EditablePreview />
                                <EditableInput name="title" size='sm'
                                onChange={handleChangeCategoryTitle}/>
                            </div>
                             {fromBudget ? 
                              <ButtonGroup justifyContent='center' size='sm' mt='2'>
                                <IconButton icon={<BiCheck />} onClick={patchCategory}/>
                                <IconButton icon={<AiOutlineClose />} onClick={() => setIsEditingTitle(false)} />
                              </ButtonGroup> : 
                             <ButtonGroup justifyContent='center' size='sm' mt='2'>
                                <IconButton icon={<BiCheck />} onClick={() => {
                                    editCategory(newCategory)
                                    setIsEditingTitle(false)
                                    }}/>
                                <IconButton icon={<AiOutlineClose />} onClick={() => setIsEditingTitle(false)} />
                            </ButtonGroup> 
                            }
                        
                              </Editable> :
                              <Button leftIcon={<BiSolidEdit />} onClick={() => setIsEditingTitle(true)}> 
                                <Heading size='md'>{category.title}</Heading>
                              </Button>
                            }
                            
                        {isEditingAmount ? 
                         <Editable defaultValue={category.amount} fontSize='md'>
                         <div>
                            <EditablePreview />
                            <EditableInput name="amount"
                            onChange={handleChangeCategoryAmount}/>
                         </div>
                         {fromBudget ? 
                            <ButtonGroup justifyContent='center' size='sm' mt='2'>
                                    <IconButton icon={<BiCheck />} onClick={patchCategory}/>
                                    <IconButton icon={<AiOutlineClose />} onClick={() => setIsEditingAmount(false)} />
                            </ButtonGroup> :
                            <ButtonGroup justifyContent='center' size='sm' mt='2'>
                                    <IconButton icon={<BiCheck />} onClick={() => {
                                        editCategory(newCategory)
                                        setIsEditingAmount(false)
                                    }}/>
                                    <IconButton icon={<AiOutlineClose />} onClick={() => setIsEditingAmount(false)} />
                            </ButtonGroup>
                         }
                         </Editable> : 
                            <Button leftIcon={<BiSolidEdit />} onClick={() => setIsEditingAmount(true)}>
                                <Text>${category.amount} Budgeted</Text>
                            </Button>}
                </div>
                <CardBody>
                    <Progress colorScheme='green' hasStripe max={category.amount} value={totalSpent}></Progress>
                </CardBody>
                <div className="progress-text">
                    <small>${totalSpent.toFixed(2)} spent</small>
                    <small>${category.amount - totalSpent} remaining</small>
                </div>
                <CardFooter justifyContent={'center'} >
                    {fromBudget ? <ButtonGroup spacing='4'>
                    <Button colorScheme='green' size='sm' rounded='full' bg='green.400' leftIcon={<GiTakeMyMoney />}
                        onClick={() => categoryLink(category.id)}>View Details</Button> 
                        <Button size='sm' colorScheme='red' bgColor='red.400'
                            rounded='full'
                            leftIcon={<BsTrash3Fill/>}
                            onClick={onOpen}>Delete</Button>
                        <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}>
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                              Delete Budget
                            </AlertDialogHeader>
                            <AlertDialogBody>
                              Are you sure? You can't undo this action afterwards.
                            </AlertDialogBody>
                            <AlertDialogFooter>
                              <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                              </Button>
                              <Button colorScheme='red' bgColor='red.400' onClick={handleDeleteCategory} ml={3}>
                                Delete
                              </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                            </ButtonGroup>
                         :
                         <>
                        <Button size='sm' colorScheme='red' bgColor='red.400'
                        rounded='full'
                        leftIcon={<BsTrash3Fill/>}
                        onClick={() => setOpen(!open)}>Delete</Button>
                        <AlertDialog
                            isOpen={open}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}>
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                              Delete Budget
                            </AlertDialogHeader>
                            <AlertDialogBody>
                              Are you sure? You can't undo this action afterwards.
                            </AlertDialogBody>
                            <AlertDialogFooter>
                              <Button ref={cancelRef} onClick={() => setOpen(!open)}>
                                Cancel
                              </Button>
                              <Button colorScheme='red' onClick={() => handleDeleteCategoryCard(category)} ml={3}>
                                Delete
                              </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                        </AlertDialog>
                        </>}
                </CardFooter>
            </Card>
        </>
  )
}

export default CategoryCard