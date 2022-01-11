import React from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  Modal,
  ModalOverlayProps,
  ModalOverlay as ChakraModalOverlay,
  ModalHeader as ChakraModalHeader,
  ModalCloseButton as ChakraModalCloseButton,
  ModalBody as ChakraModalBody,
  ModalFooter as ChakraModalFooter,
  ModalContent as ChakraModalContent,
  CloseButtonProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalContentProps,
  Button,
} from '@chakra-ui/react'
import { useConfirmDialogModel, noop } from '../../hooks/useConfirmDialog'

export const ModalOverlay: React.FC<ModalOverlayProps> = props => (
  <ChakraModalOverlay bgColor="rgba(10, 11, 38, 0.5)" {...props} />
)

export const ModalHeader: React.FC<ModalHeaderProps> = props => (
  <ChakraModalHeader p={0} {...props}>
    {props.children}
  </ChakraModalHeader>
)

export const ModalCloseButton: React.FC<CloseButtonProps> = props => (
  <ChakraModalCloseButton
    rounded="100%"
    border="2px"
    borderColor="var(--chakra-colors-gray-100)"
    top={8}
    right={8}
    {...props}
  />
)

export const ModalContent: React.FC<ModalContentProps> = props => (
  <ChakraModalContent p={8} {...props}>
    {props.children}
  </ChakraModalContent>
)

export const ModalBody: React.FC<ModalBodyProps> = props => (
  <ChakraModalBody py={8} px={0} {...props}>
    {props.children}
  </ChakraModalBody>
)

export const ModalFooter: React.FC<ModalFooterProps> = props => (
  <ChakraModalFooter p={0} {...props}>
    {props.children}
  </ChakraModalFooter>
)

export const ModalFooterButtonGroup: React.FC = props => (
  <Stack spacing={2} w="full" direction="column" {...props}>
    {props.children}
  </Stack>
)

export const ConfirmDialog: React.FC = () => {
  const { options, isOpen, isLoading, onClose, onConfirm, onCancel, isCancelLoading } =
    useConfirmDialogModel()
  const {
    type = 'success',
    title,
    description,
    content,
    cancelText,
    okText,
    modalBodyProps,
    modalContentProps,
    modalProps,
    showCloseButton = type !== 'text',
  } = options

  return (
    <Modal
      size="sm"
      closeOnEsc={showCloseButton}
      closeOnOverlayClick={showCloseButton}
      autoFocus={false}
      {...modalProps}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="24px" {...modalContentProps}>
        {showCloseButton ? <ModalCloseButton /> : null}
        <ModalBody py="32px" {...modalBodyProps}>
          {content ?? (
            <Alert
              status={type === 'text' ? undefined : type}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              bg="white"
            >
              {type !== 'text' ? (
                <AlertIcon
                  boxSize="70px"
                  mr={0}
                  mb={4}
                  {...(type === 'warning' ? { color: '#FFA940' } : {})}
                />
              ) : null}
              <AlertTitle mb={2} mx={0} fontSize="16px" fontWeight="normal">
                {title}
              </AlertTitle>
              <AlertDescription
                maxWidth="sm"
                fontSize="14px"
                color="gray.500"
                whiteSpace="pre-wrap"
              >
                {description}
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <Stack spacing={2} w="full" direction={type === 'text' ? 'row-reverse' : 'column'}>
            <Button
              isFullWidth
              variant="solid"
              isLoading={isLoading}
              onClick={onConfirm}
              fontWeight="normal"
            >
              {okText ?? 'OK'}
            </Button>

            {onCancel !== noop ? (
              <Button
                isFullWidth
                variant="outline"
                onClick={onCancel}
                fontWeight="normal"
                isLoading={isCancelLoading}
              >
                {cancelText ?? 'Cancel'}
              </Button>
            ) : null}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
