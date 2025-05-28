'use client'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import VerificationPage from '../../components/verification'
import { resendVerificationCode } from '../../../../libs/api'
import { useRouter } from 'next/navigation'
import { RootState } from '../../../../libs/store'
import { setOTP } from '../../../../libs/authSlice'

const ForgotPasswordVerification = () => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [enteredOTP, setEnteredOTP] = useState('')
  const email = useSelector((state: RootState) => state.auth.email)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleProceed = async () => {
    if (!enteredOTP) {
      setError('Please enter the verification code')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      // You might want to verify the OTP before proceeding
      // const response = await verifyOTP(email, enteredOTP)
      // if (response.success) {
        dispatch(setOTP(enteredOTP))
        router.push('/auth/create-new-password')
      // } else {
      //   setError('Invalid verification code. Please try again.')
      // }
    } catch (error) {
      setError('An error occurred while verifying the code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await resendVerificationCode(email)
      if (response.success) {
        // You might want to show a success message to the user
        alert('Verification code resent successfully!')
      } else {
        setError(response.message || 'Failed to resend code. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    }
    setIsLoading(false)
  }

  const handleChangeEmail = () => {
    router.push('/auth/forgot-password')
  }

  const handleCodeChange = (code: string) => {
    setError('') // Clear any existing errors
    setEnteredOTP(code)
  }

  return (
    <VerificationPage
      email={email}
      onProceed={handleProceed}
      onResendCode={handleResendCode}
      onChangeEmail={handleChangeEmail}
      authType="login"
      authLink="/login"
      onCodeChange={handleCodeChange}
      error={error}
      isLoading={isLoading}
    />
  )
}

export default ForgotPasswordVerification