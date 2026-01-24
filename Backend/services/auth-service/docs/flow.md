Client
→ Auth Service (create auth user)
→ emit event USER_CREATED (Kafka)
→ User Service consume event
→ create user profile
