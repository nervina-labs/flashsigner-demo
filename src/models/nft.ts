export interface NFTResponse {
  meta: ListMeta
  token_list: NFTToken[]
  holder_address: string
}

export interface TransferState {
  tx?: any
  toAddress?: string
  uuid?: string
}

export interface ListMeta {
  current_page: number
  total_count: number
}

export enum NftType {
  Audio = 'audio',
  Video = 'video',
  ThreeD = 'three_d',
  Picture = 'image',
}

export interface CardBack {
  card_back_content_exist: boolean
  card_back_content: string
  class_card_back_content?: string
  class_card_back_content_exist?: boolean
}

export interface NFTToken extends CardBack {
  renderer_type: NftType
  class_name: string
  class_bg_image_url: string
  class_uuid: string
  class_description: string
  class_total: string
  token_uuid: string
  class_id: string
  issuer_avatar_url?: string
  issuer_name?: string
  issuer_uuid?: string
  tx_state: TransactionStatus
  from_address?: string
  to_address?: string
  is_issuer_banned: boolean
  is_class_banned: boolean
  n_token_id: number
}

export enum TransactionStatus {
  Pending = 'pending',
  Committed = 'committed',
  Submitting = 'submitting',
}
