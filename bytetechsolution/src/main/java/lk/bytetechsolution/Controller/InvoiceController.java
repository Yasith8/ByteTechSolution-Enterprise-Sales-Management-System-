package lk.bytetechsolution.Controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.bytetechsolution.Dao.CustomerDao;
import lk.bytetechsolution.Dao.CustomerPaymentDao;
import lk.bytetechsolution.Dao.EmployeeDao;
import lk.bytetechsolution.Dao.InvoiceDao;
import lk.bytetechsolution.Dao.InvoiceStatusDao;
import lk.bytetechsolution.Dao.PaymentTypeDao;
import lk.bytetechsolution.Dao.SerialNoListDao;
import lk.bytetechsolution.Dao.UserDao;
import lk.bytetechsolution.Entity.CustomerEntity;
import lk.bytetechsolution.Entity.CustomerPaymentEntity;
import lk.bytetechsolution.Entity.InvoiceEntity;
import lk.bytetechsolution.Entity.InvoiceItemEntity;
import lk.bytetechsolution.Entity.SerialNoListEntity;
import lk.bytetechsolution.Entity.UserEntity;

@RestController
public class InvoiceController {
    @Autowired
    private InvoiceDao daoInvoice;
    @Autowired
    private UserDao daoUser;

    @Autowired
    private InvoiceStatusDao daoInvoiceStatus;

    @Autowired
    private EmployeeDao daoEmployee;

    @Autowired
    private CustomerDao daoCustomer;

    @Autowired
    private PaymentTypeDao daoPaymentType;

    @Autowired
    private CustomerPaymentDao daoCustomerPayment;

    @Autowired
    private SerialNoListDao daoSerialNoList;

    @Autowired
    private PrivilageController privilageController;

    @RequestMapping(value = "/invoice")
    public ModelAndView GetInvoiceUI() {
        // get logged user authentication object using security
        // this help to retrieve the current authentication object which holds the user
        // detail
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // get current log user
        UserEntity loggedUser = daoUser.getByUsername(authentication.getName());

        // current loggedemployee
        String loggedEmployee = daoEmployee.getFullnameById(loggedUser.getId());

        // Create a new ModelAndView object to hold the model data and view information
        ModelAndView invoiceView = new ModelAndView();
        // pass the ui
        invoiceView.setViewName("invoice.html");
        // attributes set to show titles in web page using theamleaf
        invoiceView.addObject("title", "Invoice Management || Bytetech Solution");
        invoiceView.addObject("user", authentication.getName());// passing logged user name
        invoiceView.addObject("EmpName", loggedEmployee);
        invoiceView.addObject("UserRole", loggedUser.getRoles().iterator().next().getName());// get the first role
        invoiceView.addObject("LoggedUserPhoto", loggedUser.getPhoto());

        return invoiceView;
    }

    @GetMapping(value = "/invoice/alldata", produces = "application/json")
    public List<InvoiceEntity> GetGInvoiceDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "INVOICE");

        if (!userPrivilage.get("select")) {
            return new ArrayList<InvoiceEntity>();
        }

        return daoInvoice.findAll();
    }

    @PostMapping(value = "/invoice")
    public String AddInvoice(@RequestBody InvoiceEntity invoice) {
        // authentiction and autherzation
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "INVOICE");

        if (!userPrivilage.get("insert")) {
            return "Permission Denied! Save not Completed";
        }

        try {
            // set AutoGenarated Value
            String nextNumber = daoInvoice.getNextInvoiceCode();

            // if next employee number is not come then set manualy last number+1
            if (nextNumber == null) {
                invoice.setInvoiceno("CCO0001");
            } else {
                invoice.setInvoiceno(nextNumber);
            }

            UserEntity addedUserData = daoUser.getByUsername(authentication.getName());
            invoice.setAddeduser(addedUserData.getId());

            invoice.setAddeddate(LocalDateTime.now());

            for (InvoiceItemEntity invoiceitem : invoice.getInvoice_item()) {
                invoiceitem.setInvoice_id((invoice));

                // inventory release
                String serialNumberString = invoiceitem.getSerial_no();
                System.err.println("Checking Serial No: " + serialNumberString);
                SerialNoListEntity serialNo = daoSerialNoList.findBySerialNo(serialNumberString);

                if (serialNo != null) {
                    Integer quantity = invoiceitem.getQuantity();
                    Integer updatedQuantity = quantity - 1;
                    serialNo.setQuantity(updatedQuantity);

                    if (updatedQuantity == 0) {
                        serialNo.setStatus(false);
                    }
                    daoSerialNoList.save(serialNo);
                } 

            }

            daoInvoice.save(invoice);

            // dependency management
            // customer payment manage
            CustomerPaymentEntity customerPayment = new CustomerPaymentEntity();

            // create the customer payment no
            String nextCustomerPaymentNumber = daoCustomerPayment.getNextCustomerPaymentCode();
            customerPayment.setPaymentno(nextCustomerPaymentNumber != null ? nextCustomerPaymentNumber : "CPY0001");

            customerPayment.setTotalamount(invoice.getFinalamount());
            customerPayment.setPaidamount(invoice.getPaidamount());
            customerPayment.setBalance(invoice.getBalance());

            customerPayment.setInvoice_id(daoInvoice.getReferenceById(invoice.getId()));
            customerPayment.setCustomer_id(invoice.getCustomer_id());
            customerPayment.setInvoicestatus_id(invoice.getInvoicestatus_id());

            customerPayment.setAddeddate(invoice.getAddeddate());
            customerPayment.setAddeduser(invoice.getAddeduser());
            customerPayment.setPaymenttype_id(daoPaymentType.getReferenceById(1));

            daoCustomerPayment.save(customerPayment);

            // customer manage
            CustomerEntity customer = daoCustomer.getReferenceById(invoice.getCustomer_id().getId());
            BigDecimal currentTotalAmount = customer.getTotalpurchase();
            BigDecimal newTotalAmount = invoice.getPaidamount();
            BigDecimal UpdatedTotalAmount = currentTotalAmount.add(newTotalAmount);
            customer.setTotalpurchase(UpdatedTotalAmount);
            daoCustomer.save(customer);

            return "OK";

        } catch (Exception e) {
            return "Save not Completed: " + e.getMessage();
        }

    }

    @DeleteMapping(value = "/invoice")
    public String DeleteInvoice(@RequestBody InvoiceEntity invoice) {
        // Autherntication and autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "INVOICE");

        if (!userPrivilage.get("delete")) {
            return "Permission Denied! Delete not Completed";
        }

        InvoiceEntity extInvoice = daoInvoice.getReferenceById(invoice.getId());
        if (extInvoice == null) {
            return "Delete not Completed.Invoice not exists";
        }

        try {
            UserEntity deleteUser = daoUser.getByUsername(authentication.getName());
            invoice.setDeleteuser(deleteUser.getId());

            invoice.setDeletedate(LocalDateTime.now());

            invoice.setInvoicestatus_id(daoInvoiceStatus.getReferenceById(3));

            daoInvoice.save(invoice);

            return "OK";
        } catch (Exception e) {
            return "Delete not completed. " + e.getMessage();
        }
    }

    @PutMapping(value = "/invoice")
    public String updateInvoice(@RequestBody InvoiceEntity invoice) {

        // Authentication and Autherization
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String, Boolean> userPrivilage = privilageController.getPrivilageByUserModule(authentication.getName(),
                "INVOICE");

        if (!userPrivilage.get("update")) {
            return "Permission Denied! Update not Completed";
        }

        InvoiceEntity extInvoice = daoInvoice.getReferenceById(invoice.getId());
        if (extInvoice == null) {
            return "Update not Completed.Invoice not exists";
        }

        try {
            // asign update user
            UserEntity modifyUser = daoUser.getByUsername(authentication.getName());
            invoice.setModifyuser(modifyUser.getId());

            // assign update date
            invoice.setModifydate(LocalDateTime.now());

            for (InvoiceItemEntity invoiceitem : invoice.getInvoice_item()) {
                invoiceitem.setInvoice_id((invoice));
            }

            // save the data
            daoInvoice.save(invoice);
            return "OK";
        } catch (Exception e) {
            return "Update not Completed." + e.getMessage();
        }
    }

}
