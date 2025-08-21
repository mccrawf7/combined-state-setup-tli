import React, { useState, useCallback } from 'react';
import { 
  Page, 
  IndexTable, 
  Text, 
  Badge, 
  Button, 
  Modal, 
  TextField, 
  Link, 
  Select, 
  BlockStack, 
  InlineStack, 
  ChoiceList,
  Icon
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';

function TaxModal({
  open,
  onClose,
  onSave,
  initialSalesTax,
  initialAutomatedFiling,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (salesTax: boolean, automatedFiling: boolean) => void;
  initialSalesTax: boolean;
  initialAutomatedFiling: boolean;
}) {
  const [taxId, setTaxId] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [formsModalOpen, setFormsModalOpen] = useState(false);
  const [selectedForm] = useState('FL DR15-CS');
  const [automatedFiling, setAutomatedFiling] = useState(initialAutomatedFiling);
  const [salesTax, setSalesTax] = useState(initialSalesTax);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shippingTax, setShippingTax] = useState(['where_applicable']);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(salesTax, automatedFiling);
  };

  const getPrimaryActionContent = () => {
    if (!salesTax) return 'Save';
    return automatedFiling ? 'Collect and Enroll' : 'Collect';
  };

  const handleFrequencyChange = useCallback(
    (value: string) => setFrequency(value),
    [],
  );

  const handleAutomatedFilingChange = useCallback(
    () => {
      if (!salesTax) return;
      setAutomatedFiling((prev) => !prev);
    },
    [salesTax],
  );

  const handleSalesTaxChange = useCallback(
    () => {
      setSalesTax((prev) => {
        if (!prev) {
          return true;
        } else {
          setAutomatedFiling(false);
          return false;
        }
      });
    },
    [],
  );

  const handleShippingTaxChange = useCallback(
    (value: string[]) => setShippingTax(value),
    [],
  );

  const toggleAdvancedOptions = useCallback(
    () => setShowAdvanced((prev) => !prev),
    [],
  );

  const getAutomatedFilingBadge = () => {
    if (!salesTax) {
      return (
        <div style={{ opacity: '0.5' }}>
          <Badge progress="complete">Off</Badge>
        </div>
      );
    }
    return (
      <Badge tone={automatedFiling ? "success" : "critical"} progress="complete">
        {automatedFiling ? 'On' : 'Off'}
      </Badge>
    );
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Edit Florida sales tax setup"
        primaryAction={{
          content: getPrimaryActionContent(),
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleClose,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="span" variant="bodyMd">Sales tax collection</Text>
              <Button
                onClick={handleSalesTaxChange}
                variant="tertiary"
              >
                <Badge tone={salesTax ? "success" : "critical"} progress="complete">
                  {salesTax ? 'On' : 'Off'}
                </Badge>
              </Button>
            </InlineStack>

            <InlineStack align="space-between">
              <Text as="span" variant="bodyMd">Automated filing</Text>
              <Button
                onClick={handleAutomatedFilingChange}
                variant="tertiary"
                disabled={!salesTax}
              >
                {getAutomatedFilingBadge()}
              </Button>
            </InlineStack>

            {automatedFiling && (
              <>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">Forms</Text>
                  <InlineStack gap="200" align="start">
                    <TextField
                      value={selectedForm}
                      disabled
                      autoComplete="off"
                      required={automatedFiling}
                    />
                    <Button 
                      icon={PlusIcon}
                      disabled
                      onClick={() => setFormsModalOpen(true)}
                    >
                      Set up
                    </Button>
                  </InlineStack>
                </BlockStack>

                <Select
                  label="Form Frequency"
                  options={[
                    {label: 'Monthly', value: 'monthly'},
                    {label: 'Quarterly', value: 'quarterly'},
                    {label: 'Annually', value: 'annually'},
                  ]}
                  onChange={handleFrequencyChange}
                  value={frequency}
                  required={automatedFiling}
                />

                <TextField
                  label="Sales tax ID"
                  value={taxId}
                  onChange={setTaxId}
                  autoComplete="off"
                  required
                />
              </>
            )}

            {salesTax && (
              <>
                <Text as="p" variant="bodyMd">
                  Sales tax is automatically applied to orders except where goods or services are exempt. Common exemptions in Florida include groceries, medical supplies and services.{' '}
                  <Link url="#">Set or review product categories</Link>{' '}
                  as needed.
                </Text>

                <Button
                  plain
                  onClick={toggleAdvancedOptions}
                  disclosure={showAdvanced ? 'up' : 'down'}
                >
                  {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
                </Button>

                {showAdvanced && (
                  <BlockStack gap="400">
                    <ChoiceList
                      title="Shipping tax"
                      selected={shippingTax}
                      choices={[
                        {label: 'Where applicable', value: 'where_applicable'},
                        {label: 'Always', value: 'always'},
                        {label: 'Never', value: 'never'},
                      ]}
                      onChange={handleShippingTaxChange}
                    />
                  </BlockStack>
                )}
              </>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      <Modal
        open={formsModalOpen}
        onClose={() => setFormsModalOpen(false)}
        title="Select tax forms"
        primaryAction={{
          content: 'Confirm',
          onAction: () => setFormsModalOpen(false),
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setFormsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Text as="p" variant="bodyMd">
            Only one form is available for Florida:
          </Text>
          <div style={{marginTop: '8px'}}>
            <Text as="p" variant="bodyMd" fontWeight="semibold">
              FL DR15-CS
            </Text>
          </div>
        </Modal.Section>
      </Modal>
    </>
  );
}

export function App() {
  const [showModal, setShowModal] = useState(false);
  const [salesTaxEnabled, setSalesTaxEnabled] = useState(false);
  const [automatedFilingEnabled, setAutomatedFilingEnabled] = useState(false);

  const resourceName = {
    singular: 'state',
    plural: 'states',
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSave = (newSalesTaxState: boolean, newAutomatedFilingState: boolean) => {
    setSalesTaxEnabled(newSalesTaxState);
    setAutomatedFilingEnabled(newAutomatedFilingState);
    setShowModal(false);
  };

  const getStatusBadge = () => {
    if (salesTaxEnabled && automatedFilingEnabled) {
      return <Badge tone="success">Collecting and filing</Badge>;
    }
    if (salesTaxEnabled) {
      return <Badge tone="success">Collecting</Badge>;
    }
    return <Badge tone="info">Ready to collect</Badge>;
  };

  const getActionButton = () => {
    const buttonText = (!salesTaxEnabled && !automatedFilingEnabled) 
      ? "Set up tax collection"
      : "Edit setup";

    return (
      <Button onClick={handleEdit}>
        {buttonText}
      </Button>
    );
  };

  const floridaRow = (
    <IndexTable.Row id="florida" position={0}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          Florida
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {getStatusBadge()}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {getActionButton()}
      </IndexTable.Cell>
    </IndexTable.Row>
  );

  const addStateRow = (
    <IndexTable.Row id="add-state" position={1}>
      <IndexTable.Cell colSpan={3}>
        <Button
          icon={PlusIcon}
          onClick={() => {}}
          variant="plain"
          textAlign="left"
          fullWidth
        >
          Add state
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  );

  return (
    <>
      <Page title="United States" fullWidth>
        <IndexTable
          resourceName={resourceName}
          itemCount={2} // Includes Florida and Add state row
          headings={[
            {title: 'State'},
            {title: 'Status'},
            {title: ''}, // Empty header for actions column
          ]}
          selectable={false}
        >
          {floridaRow}
          {addStateRow}
        </IndexTable>
      </Page>

      {showModal && (
        <TaxModal
          open={showModal}
          onClose={handleModalClose}
          onSave={handleSave}
          initialSalesTax={salesTaxEnabled}
          initialAutomatedFiling={automatedFilingEnabled}
        />
      )}
    </>
  );
}
