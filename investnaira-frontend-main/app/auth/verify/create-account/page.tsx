'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VerificationPage from '../../components/verification'
import { verifyAccount, resendVerificationCode } from '../../../../libs/api'
import { useRouter } from 'next/navigation'
import { RootState } from '../../../../libs/store' 
import { setOTP } from '../../../../libs/authSlice' 

const CreateAccountVerification = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const email = useSelector((state: RootState) => state.auth.email)
  const otp = useSelector((state: RootState) => state.auth.otp)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleProceed = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await verifyAccount(email, otp)
      if (response.success) {
        router.push('/dashboard')
      } else {
        setError(response.message || 'OTP Verification failed. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    }
    setIsLoading(false)
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await resendVerificationCode(email)
      if (response.success) {
        // alert('Verification code resent successfully!')
      } else {
        setError(response.message || 'Failed to resend code. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    }
    setIsLoading(false)
  }

  const handleChangeEmail = () => {
    router.push('/auth/create-account')
  }

  const handleCodeChange = (code: string) => {
    dispatch(setOTP(code))
  }

  return (
    <VerificationPage
      email={email}
      onProceed={handleProceed}
      onResendCode={handleResendCode}
      onChangeEmail={handleChangeEmail}
      authType="signup"
      authLink="/login"
      onCodeChange={handleCodeChange}
      error={error}
      isLoading={isLoading}
    />
  )
}

export default CreateAccountVerification