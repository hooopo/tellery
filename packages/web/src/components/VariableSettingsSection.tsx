import { useBlockSuspense, useGetBlock } from '@app/hooks/api'
import { useBlockTranscations } from '@app/hooks/useBlockTranscation'
import { ThemingVariables } from '@app/styles'
import { Editor } from '@app/types'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import React, { useCallback } from 'react'
import { useVariableCurrentValueState } from './editor/hooks/useVariable'
import FormInput from './kit/FormInput'
import FormSelect from './kit/FormSelect'
import { QueryBlockSelectInput } from './QueryBlockSelectInput'

const SectionHeader = styled.div`
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: ${ThemingVariables.colors.text[0]};
  padding: 17px 16px 8px;
`
const Label = styled.div`
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${ThemingVariables.colors.text[1]};
  padding-left: 6px;
`
const FormItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 10px;
  align-items: center;
`
const VariableFormInput = styled(FormInput)`
  width: 130px;
  height: 32px;
  padding: 0 8px;
`

export const VariableSettingsSection: React.FC<{ storyId: string; blockId: string }> = ({ storyId, blockId }) => {
  const block = useBlockSuspense<Editor.ControlBlock>(blockId)
  const blockTranscations = useBlockTranscations()
  const handleUpdateVariableName = useCallback(
    (value: string) => {
      blockTranscations.updateBlockProps(block.storyId!, block.id, ['content', 'name'], value)
    },
    [block.id, block.storyId, blockTranscations]
  )

  const variableName = block.content.name ?? block.id
  const [, setVariableValue] = useVariableCurrentValueState(block.storyId!, variableName)

  const handleUpdateVariableType = useCallback(
    (value: 'text' | 'number' | 'transclusion' | 'decimal' | 'float') => {
      blockTranscations.updateBlockProps(block.storyId!, block.id, ['content', 'type'], value)
    },
    [block.id, block.storyId, blockTranscations]
  )

  const handleUpdateDefaultValue = useCallback(
    (value: string) => {
      setVariableValue(value)
      blockTranscations.updateBlockProps(block.storyId!, block.id, ['content', 'defaultValue'], value)
    },
    [block.id, block.storyId, blockTranscations, setVariableValue]
  )

  return (
    <div>
      <SectionHeader>Settings</SectionHeader>
      <FormItem>
        <Label>Variable name</Label>
        <VariableFormInput
          value={block.content.name}
          onChange={(e) => {
            handleUpdateVariableName(e.currentTarget.value)
          }}
        ></VariableFormInput>
      </FormItem>
      <FormItem>
        <Label>Variable type</Label>
        <FormSelect
          value={block.content.type}
          className={css`
            width: 130px;
          `}
          onChange={(e) => {
            handleUpdateVariableType(e.target.value as 'text' | 'number' | 'transclusion' | 'float')
          }}
        >
          {['text', 'number', 'transclusion', 'float'].map((name) => {
            return <option key={name}>{name}</option>
          })}
        </FormSelect>
      </FormItem>

      <FormItem>
        <Label>Default value</Label>
        {(block.content.type === 'text' || block.content.type === 'number' || block.content.type === 'float') && (
          <VariableFormInput
            value={block.content.defaultValue}
            onChange={(e) => {
              handleUpdateDefaultValue(e.currentTarget.value)
            }}
          ></VariableFormInput>
        )}
        {block.content.type === 'transclusion' && (
          <div
            className={css`
              width: 130px;
              height: 32px;
              padding: 0 8px;
              border: 1px solid ${ThemingVariables.colors.gray[1]};
              border-radius: 8px;
              outline: none;
              font-size: 14px;
              font-weight: normal;
              padding: 0 15px;
              height: 36px;
              box-sizing: border-box;
              background-color: ${ThemingVariables.colors.gray[5]};
            `}
          >
            <QueryBlockSelectInput
              onChange={(blockId: string) => {
                handleUpdateDefaultValue(blockId)
              }}
              value={block.content.defaultValue}
            />
          </div>
        )}
      </FormItem>
    </div>
  )
}
