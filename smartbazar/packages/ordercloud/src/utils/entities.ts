export const COMMERCE_ENTITIES = {
  AdminAddresses_List: 'AdminAddresses.List',
  AdminUsers_List: 'AdminUsers.List',
  ApiClients_List: 'ApiClients.List',
  SellerApprovalRules_List: 'SellerApprovalRules.List',
  Buyers_List: 'Buyers.List',
  Addresses_List: 'Addresses.List',
  ApprovalRules_List: 'ApprovalRules.List',
  CostCenters_List: 'CostCenters.List',
  CreditCards_List: 'CreditCards.List',
  Buyers_ListBuyerSellers: 'Buyers.ListBuyerSellers',
  SpendingAccounts_List: 'SpendingAccounts.List',
  UserGroups_List: 'UserGroups.List',
  Users_List: 'Users.List',
  Users_ListAcrossBuyers: 'Users.ListAcrossBuyers',
  Cart_ListLineItems: 'Cart.ListLineItems',
  Cart_ListPayments: 'Cart.ListPayments',
  Cart_ListPromotions: 'Cart.ListPromotions',
  Catalogs_List: 'Catalogs.List',
  Categories_List: 'Categories.List',
  ImpersonationConfigs_List: 'ImpersonationConfigs.List',
  Incrementors_List: 'Incrementors.List',
  IntegrationEvents_List: 'IntegrationEvents.List',
  LineItems_ListAcrossOrders: 'LineItems.ListAcrossOrders',
  Locales_List: 'Locales.List',
  Me_ListAddresses: 'Me.ListAddresses',
  Me_ListCatalogs: 'Me.ListCatalogs',
  Me_ListCategories: 'Me.ListCategories',
  Me_ListCostCenters: 'Me.ListCostCenters',
  Me_ListCreditCards: 'Me.ListCreditCards',
  Me_ListOrders: 'Me.ListOrders',
  Me_ListApprovableOrders: 'Me.ListApprovableOrders',
  Me_ListProductCollections: 'Me.ListProductCollections',
  Me_ListProductCollectionEntries: 'Me.ListProductCollectionEntries',
  Me_ListProducts: 'Me.ListProducts',
  Me_ListSpecs: 'Me.ListSpecs',
  Me_ListVariants: 'Me.ListVariants',
  Me_ListPromotions: 'Me.ListPromotions',
  Me_ListBuyerSellers: 'Me.ListBuyerSellers',
  Me_ListShipments: 'Me.ListShipments',
  Me_ListShipmentItems: 'Me.ListShipmentItems',
  Me_ListSpendingAccounts: 'Me.ListSpendingAccounts',
  Me_ListUserGroups: 'Me.ListUserGroups',
  MessageSenders_List: 'MessageSenders.List',
  MessageSenders_ListCCListenerAssignments:
    'MessageSenders.ListCCListenerAssignments',
  OpenIdConnects_List: 'OpenIdConnects.List',
  OrderReturns_List: 'OrderReturns.List',
  OrderReturns_ListApprovals: 'OrderReturns.ListApprovals',
  OrderReturns_ListEligibleApprovers: 'OrderReturns.ListEligibleApprovers',
  Orders_List: 'Orders.List',
  Orders_ListApprovals: 'Orders.ListApprovals',
  Orders_ListEligibleApprovers: 'Orders.ListEligibleApprovers',
  LineItems_List: 'LineItems.List',
  Payments_List: 'Payments.List',
  Orders_ListPromotions: 'Orders.ListPromotions',
  Orders_ListShipments: 'Orders.ListShipments',
  PriceSchedules_List: 'PriceSchedules.List',
  ProductFacets_List: 'ProductFacets.List',
  Products_List: 'Products.List',
  InventoryRecords_List: 'InventoryRecords.List',
  Products_ListSpecs: 'Products.ListSpecs',
  Products_ListSuppliers: 'Products.ListSuppliers',
  Products_ListVariants: 'Products.ListVariants',
  InventoryRecords_ListVariant: 'InventoryRecords.ListVariant',
  Promotions_List: 'Promotions.List',
  SecurityProfiles_List: 'SecurityProfiles.List',
  Shipments_List: 'Shipments.List',
  Shipments_ListItems: 'Shipments.ListItems',
  Specs_List: 'Specs.List',
  Specs_ListOptions: 'Specs.ListOptions',
  Specs_ListProductAssignments: 'Specs.ListProductAssignments',
  Suppliers_List: 'Suppliers.List',
  SupplierAddresses_List: 'SupplierAddresses.List',
  Suppliers_ListBuyers: 'Suppliers.ListBuyers',
  SupplierUserGroups_List: 'SupplierUserGroups.List',
  SupplierUsers_List: 'SupplierUsers.List',
  AdminUserGroups_List: 'AdminUserGroups.List',
  Webhooks_List: 'Webhooks.List',
  XpIndices_List: 'XpIndices.List',
};

export type CommerceEntity = keyof typeof COMMERCE_ENTITIES;
